/**
 * Generate Visualization Tests -- Template System Overhaul
 *
 * Covers: Zod schema validation for role/density, pipeline passthrough,
 * all 13 layouts through the full rendering pipeline, error handling.
 */

import { describe, it, expect } from 'vitest';
import {
  generateVisualization,
  generateVisualizationSchema,
  type GenerateVisualizationInput,
} from './generate_visualization.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function minimalInput(overrides: Partial<GenerateVisualizationInput> = {}): GenerateVisualizationInput {
  return {
    content: 'Test content',
    selectedSystems: [
      {
        id: 1,
        title: 'Test Chart',
        description: 'A test bar chart',
        diagramType: 'bar',
        chartData: [
          { label: 'A', value: 10 },
          { label: 'B', value: 20 },
          { label: 'C', value: 30 },
        ],
      },
    ],
    theme: 'tokyo_night',
    navigationStyle: 'minimal',
    enableThemeSwitcher: true,
    ...overrides,
  } as any;
}

// ---------------------------------------------------------------------------
// Schema Validation
// ---------------------------------------------------------------------------

describe('Zod Schema -- role field', () => {
  it('should accept all valid role values', () => {
    const roles = ['default', 'metric', 'pull-quote', 'lead', 'statement', 'full-width', 'supporting'];
    for (const role of roles) {
      const input = {
        ...minimalInput(),
        selectedSystems: [{
          id: 1, title: 'T', description: 'D', diagramType: 'bar',
          chartData: [{ label: 'A', value: 1 }],
          role,
        }],
      };
      const result = generateVisualizationSchema.safeParse(input);
      expect(result.success, `role="${role}" should parse`).toBe(true);
    }
  });

  it('should reject invalid role values', () => {
    const input = {
      ...minimalInput(),
      selectedSystems: [{
        id: 1, title: 'T', description: 'D', diagramType: 'bar',
        chartData: [{ label: 'A', value: 1 }],
        role: 'invalid-role',
      }],
    };
    const result = generateVisualizationSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should accept missing role (optional, defaults to undefined)', () => {
    const input = minimalInput();
    const result = generateVisualizationSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe('Zod Schema -- density field', () => {
  it('should accept all valid density values', () => {
    for (const density of ['compact', 'comfortable', 'spacious']) {
      const input = { ...minimalInput(), density };
      const result = generateVisualizationSchema.safeParse(input);
      expect(result.success, `density="${density}" should parse`).toBe(true);
    }
  });

  it('should reject invalid density values', () => {
    const input = { ...minimalInput(), density: 'ultra-tight' };
    const result = generateVisualizationSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should default density to comfortable when omitted', () => {
    const input = minimalInput();
    delete (input as any).density;
    const result = generateVisualizationSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.density).toBe('comfortable');
    }
  });
});

describe('Zod Schema -- layout field', () => {
  it('should accept all 13 layout values', () => {
    const layouts = [
      'sidebar', 'magazine', 'presentation', 'dashboard', 'minimal', 'editorial',
      'comparison', 'briefing', 'tutorial', 'scorecard', 'report', 'dossier', 'dialogue',
    ];
    for (const layout of layouts) {
      const input = { ...minimalInput(), layout };
      const result = generateVisualizationSchema.safeParse(input);
      expect(result.success, `layout="${layout}" should parse`).toBe(true);
    }
  });

  it('should reject unknown layout values', () => {
    const input = { ...minimalInput(), layout: 'newspaper' };
    const result = generateVisualizationSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Pipeline -- Role Passthrough
// ---------------------------------------------------------------------------

describe('Pipeline -- Role Passthrough', () => {
  it('should pass role through to Section objects in generated HTML', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      layout: 'dashboard',
      selectedSystems: [
        {
          id: 1, title: 'MRR', description: '$500K',
          diagramType: 'bar',
          chartData: [{ label: 'A', value: 1 }],
          role: 'metric',
        },
        {
          id: 2, title: 'Revenue Trend', description: 'Growing',
          diagramType: 'bar',
          chartData: [{ label: 'Q1', value: 100 }, { label: 'Q2', value: 200 }],
        },
      ],
    } as any);

    expect(result.success).toBe(true);
    // Metric role should produce metric-card in dashboard layout
    expect(result.html).toContain('metric-card');
    expect(result.html).toContain('MRR');
    expect(result.html).toContain('$500K');
  });
});

// ---------------------------------------------------------------------------
// Pipeline -- Density Passthrough
// ---------------------------------------------------------------------------

describe('Pipeline -- Density Passthrough', () => {
  it('should apply compact density to the HTML body', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      density: 'compact',
    } as any);

    expect(result.success).toBe(true);
    expect(result.html).toContain('data-density="compact"');
  });

  it('should apply spacious density to the HTML body', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      density: 'spacious',
    } as any);

    expect(result.success).toBe(true);
    expect(result.html).toContain('data-density="spacious"');
  });
});

// ---------------------------------------------------------------------------
// Pipeline -- All 13 Layouts Render Successfully
// ---------------------------------------------------------------------------

describe('Pipeline -- All Layouts', () => {
  const layouts = [
    'sidebar', 'magazine', 'presentation', 'dashboard', 'minimal', 'editorial',
    'comparison', 'briefing', 'tutorial', 'scorecard', 'report', 'dossier', 'dialogue',
  ];

  for (const layout of layouts) {
    it(`should render ${layout} layout without errors`, async () => {
      const result = await generateVisualization({
        ...minimalInput(),
        layout,
        title: `Test ${layout}`,
      } as any);

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain(`Test ${layout}`);
      expect(result.stats.sectionsRendered).toBe(1);
      expect(result.stats.diagramsRendered).toBe(1);
      expect(result.stats.layout).toBe(layout);
      expect(result.stats.fileSize).toBeGreaterThan(0);
    });
  }
});

// ---------------------------------------------------------------------------
// Pipeline -- Complex Scenarios
// ---------------------------------------------------------------------------

describe('Pipeline -- Complex Scenarios', () => {
  it('should handle a dashboard with mixed roles (metric + chart)', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      layout: 'dashboard',
      selectedSystems: [
        { id: 1, title: 'Users', description: '12,400', diagramType: 'bar', chartData: [{ label: 'x', value: 1 }], role: 'metric' },
        { id: 2, title: 'MRR', description: '$847K', diagramType: 'bar', chartData: [{ label: 'x', value: 1 }], role: 'metric' },
        { id: 3, title: 'Revenue Trend', description: 'Growing', diagramType: 'bar', chartData: [{ label: 'Q1', value: 100 }, { label: 'Q2', value: 200 }] },
        { id: 4, title: 'Churn by Segment', description: 'Detail', diagramType: 'bar', chartData: [{ label: 'SMB', value: 5 }, { label: 'Enterprise', value: 1 }] },
        { id: 5, title: 'Pipeline', description: 'Flow', diagramType: 'bar', chartData: [{ label: 'Leads', value: 300 }, { label: 'Closed', value: 40 }] },
      ],
    } as any);

    expect(result.success).toBe(true);
    expect(result.stats.sectionsRendered).toBe(5);
    expect(result.stats.diagramsRendered).toBe(5);
    expect(result.html).toContain('metric-card');
    expect(result.html).toContain('span-8');
    expect(result.html).toContain('span-4');
    expect(result.html).toContain('span-6');
  });

  it('should handle a presentation with all slide types', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      layout: 'presentation',
      selectedSystems: [
        { id: 1, title: 'Big statement', description: 'We are growing.', diagramType: 'bar', chartData: [{ label: 'x', value: 1 }], role: 'statement' },
        { id: 2, title: '$12M', description: 'Annual Revenue', diagramType: 'bar', chartData: [{ label: 'x', value: 1 }], role: 'metric' },
        { id: 3, title: 'Revenue', description: 'Trend', diagramType: 'bar', chartData: [{ label: 'Q1', value: 5 }, { label: 'Q2', value: 8 }], role: 'full-width' },
        { id: 4, title: 'Standard', description: 'Slide', diagramType: 'bar', chartData: [{ label: 'A', value: 1 }] },
      ],
    } as any);

    expect(result.success).toBe(true);
    expect(result.html).toContain('slide-statement');
    expect(result.html).toContain('slide-metric');
    expect(result.html).toContain('slide-full-width');
    expect(result.html).toContain('metric-display');
    expect(result.html).toContain('$12M');
  });

  it('should handle a report with main and appendix sections', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      layout: 'report',
      selectedSystems: [
        { id: 1, title: 'Introduction', description: 'Main body', diagramType: 'bar', chartData: [{ label: 'A', value: 1 }] },
        { id: 2, title: 'Analysis', description: 'Charts', diagramType: 'bar', chartData: [{ label: 'B', value: 2 }] },
        { id: 3, title: 'Appendix A', description: 'Supplementary', diagramType: 'bar', chartData: [{ label: 'C', value: 3 }], role: 'supporting' },
      ],
    } as any);

    expect(result.success).toBe(true);
    expect(result.html).toContain('report-toc');
    expect(result.html).toContain('report-cover');
    expect(result.html).toContain('report-section supporting');
    expect(result.html).toContain('>1.<');
    expect(result.html).toContain('>2.<');
    expect(result.html).toContain('>3.<');
  });

  it('should handle a dialogue with full argument structure', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      layout: 'dialogue',
      title: 'Build vs Buy?',
      selectedSystems: [
        { id: 1, title: 'Build', description: 'Custom solution', diagramType: 'bar', chartData: [{ label: 'Cost', value: 500 }] },
        { id: 2, title: 'Buy', description: 'Vendor solution', diagramType: 'bar', chartData: [{ label: 'Cost', value: 800 }] },
        { id: 3, title: 'Trade-offs', description: 'Analysis', diagramType: 'bar', chartData: [{ label: 'A', value: 1 }], role: 'full-width' },
        { id: 4, title: 'Decision', description: 'Go hybrid', diagramType: 'bar', chartData: [{ label: 'x', value: 1 }], role: 'supporting' },
      ],
    } as any);

    expect(result.success).toBe(true);
    expect(result.html).toContain('dialogue-question');
    expect(result.html).toContain('Build vs Buy?');
    expect(result.html).toContain('dialogue-position');
    expect(result.html).toContain('dialogue-tradeoffs');
    expect(result.html).toContain('dialogue-conclusion');
  });
});

// ---------------------------------------------------------------------------
// Pipeline -- Error Handling
// ---------------------------------------------------------------------------

describe('Pipeline -- Error Handling', () => {
  it('should report errors for missing chartData but still produce HTML', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      selectedSystems: [
        { id: 1, title: 'No Data', description: 'Missing', diagramType: 'bar' },
      ],
    } as any);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Missing chartData');
    expect(result.html).toContain('<!DOCTYPE html>');
  });

  it('should report errors for missing mermaidCode but still produce HTML', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      selectedSystems: [
        { id: 1, title: 'No Code', description: 'Missing', diagramType: 'flowchart' },
      ],
    } as any);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('mermaidCode');
    expect(result.html).toContain('<!DOCTYPE html>');
  });

  it('should handle empty selectedSystems gracefully', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      selectedSystems: [],
    } as any);

    expect(result.success).toBe(true);
    expect(result.stats.sectionsRendered).toBe(0);
    expect(result.stats.diagramsRendered).toBe(0);
    expect(result.html).toContain('<!DOCTYPE html>');
  });
});

// ---------------------------------------------------------------------------
// Pipeline -- Stats Accuracy
// ---------------------------------------------------------------------------

describe('Pipeline -- Stats', () => {
  it('should report accurate section and diagram counts', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      selectedSystems: [
        { id: 1, title: 'A', description: 'D', diagramType: 'bar', chartData: [{ label: 'X', value: 1 }] },
        { id: 2, title: 'B', description: 'D', diagramType: 'bar', chartData: [{ label: 'Y', value: 2 }] },
        { id: 3, title: 'C', description: 'D', diagramType: 'bar', chartData: [{ label: 'Z', value: 3 }] },
      ],
    } as any);

    expect(result.stats.sectionsRendered).toBe(3);
    expect(result.stats.diagramsRendered).toBe(3);
  });

  it('should report correct layout in stats', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      layout: 'tutorial',
    } as any);

    expect(result.stats.layout).toBe('tutorial');
  });

  it('should report correct theme in stats', async () => {
    const result = await generateVisualization({
      ...minimalInput(),
      theme: 'dracula',
    } as any);

    expect(result.stats.theme).toBe('Dracula');
  });

  it('should report non-zero file size', async () => {
    const result = await generateVisualization(minimalInput());
    expect(result.stats.fileSize).toBeGreaterThan(1000);
  });
});
