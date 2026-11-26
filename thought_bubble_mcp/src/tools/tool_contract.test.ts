import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { server } from '../server.js';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

const client = new Client({ name: 'tool-contract-test', version: '1' });
let workspace: string;

beforeAll(async () => {
  workspace = await mkdtemp(path.join(tmpdir(), 'thought-bubble-'));
  vi.stubEnv('THOUGHT_BUBBLE_WORKSPACE', workspace);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
});

afterAll(async () => {
  await client.close();
  await server.close();
  vi.unstubAllEnvs();
  if (workspace) await rm(workspace, { recursive: true, force: true });
});

it('advertises when to call each tool and what to do with its result', async () => {
  const { tools } = await client.listTools();
  const descriptions = Object.fromEntries(tools.map(tool => [tool.name, tool.description]));
  expect(Object.keys(descriptions).sort()).toEqual([
    'analyze_content', 'generate_mermaid_prompt', 'generate_visualization', 'get_design_guide', 'list_themes',
  ]);
  for (const description of Object.values(descriptions)) {
    expect(description).toMatch(/^Use this when/i);
    expect(description).toMatch(/^RETURNS: .+/m);
  }
  expect(descriptions.analyze_content).toMatch(/RETURNS: .*prompt/i);
  expect(descriptions.analyze_content).toContain('generate_visualization');
  expect(descriptions.analyze_content).toContain('selectedSystems');
  expect(descriptions.generate_visualization).toContain('analyze_content');
  expect(descriptions.generate_visualization).toContain('mermaidCode');
  expect(descriptions.generate_visualization).toContain('chartData');
  expect(descriptions.generate_visualization).toContain('test_outputs/visualization_<timestamp>.html');
  for (const stat of ['theme', 'layout', 'sections', 'diagrams', 'file size']) {
    expect(descriptions.generate_visualization?.toLowerCase()).toContain(stat);
  }
});

it('publishes required inputs and chart field guidance to the client', async () => {
  const { tools } = await client.listTools();
  const schemas = Object.fromEntries(tools.map(tool => [tool.name, tool.inputSchema]));
  expect(schemas.analyze_content.required).toEqual(['content']);
  expect(schemas.generate_visualization.required).toEqual(['selectedSystems']);
  expect(schemas.generate_visualization.properties).toMatchObject({
    content: { type: 'string' },
    theme: { default: 'tokyo_night', description: expect.stringContaining('dracula') },
    layout: { description: expect.stringContaining('magazine') },
  });
  expect(schemas.generate_visualization.properties?.selectedSystems).toMatchObject({
    items: { properties: {
      mermaidCode: { description: expect.stringMatching(/flowchart/i) },
      chartData: { description: expect.stringMatching(/bar/i) },
      chartOptions: { properties: {
        title: { description: expect.stringMatching(/caption/i) },
        xLabel: { description: expect.stringMatching(/axis/i) },
        yLabel: { description: expect.stringMatching(/axis/i) },
      } },
    } },
  });
});

it('writes the advertised HTML file and reports render stats with source text omitted', async () => {
  const result = await client.callTool({
    name: 'generate_visualization',
    arguments: { selectedSystems: [{
      id: 1, title: 'Orders', description: 'Orders by month', diagramType: 'bar',
      chartData: [{ label: 'May', value: 4 }],
    }] },
  });
  const dir = path.join(workspace, 'test_outputs');
  const files = await readdir(dir);
  expect(files).toEqual([expect.stringMatching(/^visualization_\d+\.html$/)]);
  const filename = path.join(dir, files[0]);
  const html = await readFile(filename, 'utf8');
  expect(html).toContain('Orders by month');
  expect(html).toContain('<svg');
  expect(result.content).toEqual([{ type: 'text', text: expect.stringContaining(`File: ${filename}`) }]);
  for (const stat of ['Theme: Tokyo Night', 'Layout: sidebar', 'Sections: 1', 'Diagrams rendered: 1',
    `File size: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`]) {
    expect(result.content).toMatchObject([{ text: expect.stringContaining(stat) }]);
  }
});
