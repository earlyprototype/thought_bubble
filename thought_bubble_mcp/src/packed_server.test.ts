import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { JSDOM } from 'jsdom';
import { afterAll, beforeAll, expect, it } from 'vitest';

const client = new Client({ name: 'package-test', version: '1' });
// The unpacked server can resolve installed dependencies here, even offline.
const workspace = mkdtempSync(fileURLToPath(new URL('../node_modules/.packed-', import.meta.url)));

beforeAll(async () => {
  execSync('npm pack --offline --loglevel=error ../..', { cwd: workspace });
  const [archive] = readdirSync(workspace);
  execFileSync('tar', ['-xzf', archive], { cwd: workspace });
  await client.connect(new StdioClientTransport({
    command: process.execPath,
    args: [join(workspace, 'package', 'dist', 'index.js')],
    cwd: workspace,
  }));
}, 60_000);

afterAll(async () => {
  await client.close();
  rmSync(workspace, { recursive: true, force: true });
});

it.each(['design', 'pov', 'typography', 'layouts', 'd3', 'color', 'spacing'])(
  'reads the bundled %s guide from a clean workspace', async section => {
    const result = await client.callTool({ name: 'get_design_guide', arguments: { section } });
    expect(result).toMatchObject({ content: [{ type: 'text', text: expect.stringContaining('\n\n# ') }] });
  }
);

it('preserves comparison labels in the generated SVG and rejects event attributes', async () => {
  const accepted = [
    'decisions = definition of done',
    'x<y only if z>0',
    'x<y && online=true && z>0',
    'x<y and onload=false and z>0',
    'x<y && onload=false && z>0',
    'x<y before onload fires and z>0 afterwards',
    "<span title='onclick=example'>",
  ];
  const forbidden = [
    "<span onclick=''>",
    "<svg aria-label='a > b' ONLOAD=''>",
    "<span onbeforecopy=''>",
    "<body onload=''>",
    "<circle onclick=''>",
  ];
  const selectedSystems = [...accepted, ...forbidden].map((label, index) => ({
    id: index + 1,
    title: `Diagram ${index + 1}`,
    description: 'Flowchart',
    diagramType: 'flowchart',
    mermaidCode: `flowchart TD\n  A["${label}"] --> B[Done]`,
  }));
  const result = await client.callTool({
    name: 'generate_visualization', arguments: { content: 'Example diagrams', selectedSystems },
  });
  const [output] = readdirSync(join(workspace, 'test_outputs'));
  const html = readFileSync(join(workspace, 'test_outputs', output), 'utf8');
  const labels = Array.from(JSDOM.fragment(html).querySelectorAll('svg text'), node => node.textContent);
  for (const label of accepted) expect(labels).toContainEqual(expect.stringContaining(label));
  for (const [index, label] of forbidden.entries()) {
    expect(labels).not.toContainEqual(expect.stringContaining(label));
    const id = accepted.length + index + 1;
    expect(result).toMatchObject({
      content: [{ text: expect.stringContaining(`Mermaid render error for item ${id}: Potentially dangerous content`) }],
    });
  }
});
