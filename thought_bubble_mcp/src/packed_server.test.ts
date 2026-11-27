import { execFileSync, execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
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

it.each([
  ['design', 'DesignGuide.md'],
  ['pov', 'POV.md'],
  ['typography', 'Typography.md'],
  ['layouts', 'Layouts.md'],
  ['d3', 'D3StyleGuide.md'],
  ['color', 'ColorTheory.md'],
  ['spacing', 'Spacing.md'],
])('reads the bundled %s guide from a clean workspace', async (section, filename) => {
  const result = await client.callTool({ name: 'get_design_guide', arguments: { section } });
  const source = `design-guide/${filename}`;
  const article = readFileSync(new URL(`../${source}`, import.meta.url), 'utf8');
  const text = `# Design Guide: ${section}\n\n${article}\n\n---\n\nSource: ${source}`;
  expect(result.content).toEqual([{ type: 'text', text }]);
});

async function generateFlowcharts(nodeLabels: string[]) {
  const selectedSystems = nodeLabels.map((label, index) => ({
    id: index + 1,
    title: `Diagram ${index + 1}`,
    description: 'Flowchart',
    diagramType: 'flowchart',
    mermaidCode: `flowchart TD\n  A[${label}] --> B[Done]`,
  }));
  const result = await client.callTool({
    name: 'generate_visualization', arguments: { content: 'Example diagrams', selectedSystems },
  });
  const [message] = CallToolResultSchema.parse(result).content;
  if (message?.type !== 'text') throw new Error('Expected a text response');
  const output = /^File: (.+)$/m.exec(message.text)?.[1];
  if (!output) throw new Error(message.text);
  const document = JSDOM.fragment(readFileSync(output, 'utf8'));
  const labelsFor = (id: number) =>
    Array.from(document.querySelectorAll(`#section-${id} svg text`), node => node.textContent);
  const warningBlock = message.text.split('\n\n').find(block => block.startsWith('Errors:\n'));
  const warnings = warningBlock?.split('\n').slice(1) ?? [];
  return { result, labelsFor, warnings };
}

it('renders complete comparison labels with varied connecting prose without warnings', async () => {
  const labels = [
    'Out of Scope — negative decisions = definition of done',
    'a<b until onload fires, then c>d',
    'a<b when onload=false and c>d',
    'a<b while onload=false; subsequently c>d',
    'a<b when onload fires and c > d',
    'a<b when onload=false and c > d',
    'a<b when the title changes and onload fires, then c>d',
    'a<b until onload fires, then c > d',
    'a<b until the title changes and onload fires, then c>d',
    'a <b as onload fires and c > d',
    'a<b while the panel is open and onload fires, then c>d',
    "a<b until today's onload fires, then c>d",
    'a<b until onload fires, then (c + 1)>d',
    'a<b while the dialog is visible and onload fires, then c>d',
    'a<b while the dialog is open and onload fires, then c>d',
    'a<b until onload fires, then c>δ',
    'α<b until onload fires, then γ>δ',
    '<body>Note</body> a<b until onload fires, then c>d',
  ];
  const { result, labelsFor, warnings } = await generateFlowcharts(labels);
  for (const [index, label] of labels.entries()) {
    expect.soft(labelsFor(index + 1)).toContain(label);
  }
  expect(warnings).toEqual([]);
  expect(result).toMatchObject({
    content: [{ type: 'text', text: expect.stringMatching(/^HTML visualization generated successfully!/) }],
  });
});

it('preserves comparison labels in the generated SVG and rejects event attributes', async () => {
  const accepted = [
    'decisions = definition of done',
    'x<y only if z>0',
    'x<y && online=true && z>0',
    'x<y and onload=false and z>0',
    'x<y && onload=false && z>0',
    'x<y before onload fires and z>0 afterwards',
    'a<b && onload=false && c>d',
    'a<b && ready=true && onload=disabled && id>d',
    'a<b && onload=false && c>=d',
    'a<b before onload fires and c>d',
    'a<b before onload fires and c>-1',
    'a<b before onload fires and c>= +1',
    'a<b before onload fires and c>=.5',
    'a<b before onload fires and c>=(baseline + 1)',
    'f(a)<b before onload fires and c>d',
    'a<b && onload=false && c>=.5',
    'a<b before onload fires and f(c)>(baseline + 1)',
    "<span title='onclick=example'>",
  ];
  const forbidden = [
    "<span onclick=''>",
    "<svg aria-label='a > b' ONLOAD=''>",
    "<span onbeforecopy=''>",
    "<body onload=''>",
    "<circle onclick=''>",
    "Read <b title='before and after' onclick=''>this</b>",
    "a<b && onload=false && c>d then <span onclick=''>",
    'left<b onload=false>right',
    'left<b hidden onload=false c>right',
    'left<b when onload=false and c>right</b>',
    "<widget onload=''>value</widget>",
    'left<input readonly onload=false disabled>right',
    'left<img ismap onload=false hidden>right',
    "<math><mi onload=''/></math>",
    'left<b when onload=false and hidden>right',
    '<span>a<b when onload=false and c>d</span>',
    '<body>a<b until onload fires, then c>d</body>',
  ];
  const { result, labelsFor, warnings } = await generateFlowcharts([...accepted, ...forbidden].map(label => `"${label}"`));
  expect(warnings).toHaveLength(forbidden.length);
  for (const [index, label] of accepted.entries()) {
    const id = index + 1;
    expect.soft(labelsFor(id)).toContainEqual(expect.stringContaining(label));
    expect.soft(result).toMatchObject({
      content: [{ text: expect.not.stringContaining(`Mermaid render error for item ${id}:`) }],
    });
  }
  for (const [index, label] of forbidden.entries()) {
    const id = accepted.length + index + 1;
    const labels = labelsFor(id);
    expect(labels.map(text => text?.trim()), label).toContain('Diagram Rendering Error');
    expect(labels).not.toContainEqual(expect.stringContaining(label));
    expect(result).toMatchObject({
      content: [{ text: expect.stringContaining(`Mermaid render error for item ${id}: Potentially dangerous content`) }],
    });
  }
});
