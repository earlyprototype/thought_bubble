/**
 * D3 Renderer Tests
 */

import { describe, it, expect } from 'vitest';
import {
  renderBarChart,
  renderPieChart,
  renderLineChart,
  renderGanttChart,
  renderQuadrantChart,
  renderD3Chart,
  isD3ChartType,
  type BarChartData,
  type PieChartData,
  type LineChartData,
  type GanttChartData,
  type QuadrantData,
} from './d3_renderer.js';
import { getTheme } from '../themes/index.js';

const theme = getTheme('tokyo_night');

const BAR_DATA: BarChartData[] = [
  { label: 'Q1', value: 100 },
  { label: 'Q2', value: 150 },
  { label: 'Q3', value: 120 },
];

const PIE_DATA: PieChartData[] = [
  { label: 'Frontend', value: 40 },
  { label: 'Backend', value: 35 },
  { label: 'DevOps', value: 25 },
];

const LINE_DATA: LineChartData[] = [
  { x: 1, y: 10 },
  { x: 2, y: 25 },
  { x: 3, y: 15 },
  { x: 4, y: 30 },
];

const GANTT_DATA: GanttChartData[] = [
  { task: 'Planning', start: '2025-01-01', end: '2025-01-15', category: 'Phase 1', progress: 100 },
  { task: 'Development', start: '2025-01-10', end: '2025-02-01', category: 'Phase 2', progress: 50 },
];

const QUADRANT_DATA: QuadrantData[] = [
  { label: 'Item A', x: 75, y: 80 },
  { label: 'Item B', x: 30, y: 60 },
  { label: 'Item C', x: 60, y: 20 },
];

describe('D3 Renderer', () => {
  describe('isD3ChartType', () => {
    it('should recognize valid D3 types', () => {
      expect(isD3ChartType('bar')).toBe(true);
      expect(isD3ChartType('pie')).toBe(true);
      expect(isD3ChartType('donut')).toBe(true);
      expect(isD3ChartType('line')).toBe(true);
      expect(isD3ChartType('area')).toBe(true);
      expect(isD3ChartType('gantt')).toBe(true);
      expect(isD3ChartType('timeline')).toBe(true);
      expect(isD3ChartType('quadrant')).toBe(true);
    });

    it('should reject invalid types', () => {
      expect(isD3ChartType('flowchart')).toBe(false);
      expect(isD3ChartType('sequence')).toBe(false);
      expect(isD3ChartType('unknown')).toBe(false);
    });
  });

  describe('renderBarChart', () => {
    it('should render valid bar chart', () => {
      const result = renderBarChart(BAR_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.error).toBeUndefined();
    });

    it('should apply chart title', () => {
      const result = renderBarChart(BAR_DATA, theme, { title: 'Test Chart' });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('Test Chart');
    });

    it('should handle empty data gracefully', () => {
      const result = renderBarChart([], theme);
      // Should still render but with no bars
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should use theme colors via CSS variables', () => {
      const result = renderBarChart(BAR_DATA, theme);
      expect(result.success).toBe(true);
      // SVG background is transparent; foreground and scale colours use CSS variables
      expect(result.svg).toContain('var(--fg)');
      expect(result.svg).toContain('var(--text-secondary)');
      expect(result.svg).toContain('var(--scale-1)');
    });

    it('should handle custom dimensions', () => {
      const result = renderBarChart(BAR_DATA, theme, { width: 800, height: 500 });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('width="800"');
      expect(result.svg).toContain('height="500"');
    });

    it('should use path elements with rounded top corners', () => {
      const result = renderBarChart(BAR_DATA, theme);
      expect(result.success).toBe(true);
      // Bars should be <path> (not <rect>) with arc commands for rounded tops
      expect(result.svg).toContain('<path');
      expect(result.svg).toMatch(/class="bar"/);
      // Arc command (A) indicates rounded corners
      const pathMatches = result.svg.match(/<path[^>]*class="bar"[^>]*d="([^"]*)"/g);
      expect(pathMatches).not.toBeNull();
      if (pathMatches) {
        for (const match of pathMatches) {
          expect(match).toMatch(/A/);
        }
      }
    });

    it('should apply max-bar distinction when no explicit annotations', () => {
      const result = renderBarChart(BAR_DATA, theme);
      expect(result.success).toBe(true);
      // Max bar (Q2=150) should use the emphasis gradient
      expect(result.svg).toContain('url(#bar-gradient-max)');
      // Should include HIGHEST annotation
      expect(result.svg).toContain('HIGHEST');
    });

    it('should not apply max-bar distinction when annotations are present', () => {
      const result = renderBarChart(BAR_DATA, theme, {
        annotations: [{ dataIndex: 0, label: 'Custom note' }]
      });
      expect(result.success).toBe(true);
      // Should NOT use emphasis gradient when user annotations exist
      expect(result.svg).not.toContain('url(#bar-gradient-max)');
      expect(result.svg).not.toContain('HIGHEST');
    });

    it('should not apply max-bar distinction for single-bar charts', () => {
      const singleBar: BarChartData[] = [{ label: 'Only', value: 42 }];
      const result = renderBarChart(singleBar, theme);
      expect(result.success).toBe(true);
      expect(result.svg).not.toContain('url(#bar-gradient-max)');
      expect(result.svg).not.toContain('HIGHEST');
    });

    it('should render zero-value bars without errors', () => {
      const dataWithZero: BarChartData[] = [
        { label: 'A', value: 100 },
        { label: 'B', value: 0 },
        { label: 'C', value: 50 },
      ];
      const result = renderBarChart(dataWithZero, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should include emphasis gradient definition', () => {
      const result = renderBarChart(BAR_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('id="bar-gradient-max"');
    });

    it('should use CSS variable for body font on axis labels', () => {
      const result = renderBarChart(BAR_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('var(--font-body)');
    });

    it('should use CSS variable for display font on chart title', () => {
      const result = renderBarChart(BAR_DATA, theme, { title: 'Revenue' });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('var(--font-display)');
    });

    it('should render consistently across themes', () => {
      const themes = ['tokyo_night', 'gruvbox', 'github_light'] as const;
      for (const themeName of themes) {
        const t = getTheme(themeName);
        const result = renderBarChart(BAR_DATA, t, { title: 'Cross-theme' });
        expect(result.success).toBe(true);
        expect(result.svg).toContain('<path');
        expect(result.svg).toContain('bar-gradient-max');
      }
    });
  });

  describe('renderPieChart', () => {
    it('should render valid pie chart', () => {
      const result = renderPieChart(PIE_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
      expect(result.error).toBeUndefined();
    });

    it('should render donut chart', () => {
      const result = renderPieChart(PIE_DATA, theme, { donut: true });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should show legend by default', () => {
      const result = renderPieChart(PIE_DATA, theme);
      expect(result.success).toBe(true);
      // Should contain slice labels
      expect(result.svg).toContain('Frontend');
    });

    it('should handle empty data', () => {
      const result = renderPieChart([], theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });
  });

  describe('renderLineChart', () => {
    it('should render valid line chart', () => {
      const result = renderLineChart(LINE_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should render area chart', () => {
      const result = renderLineChart(LINE_DATA, theme, { area: true });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should handle date-based x values', () => {
      const dateData: LineChartData[] = [
        { x: '2025-01-01', y: 10 },
        { x: '2025-01-02', y: 20 },
      ];
      const result = renderLineChart(dateData, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should apply axis labels', () => {
      const result = renderLineChart(LINE_DATA, theme, { 
        title: 'Line Chart',
        xLabel: 'Time',
        yLabel: 'Value' 
      });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('Line Chart');
    });
  });

  describe('renderGanttChart', () => {
    it('should render valid gantt chart', () => {
      const result = renderGanttChart(GANTT_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should show task names', () => {
      const result = renderGanttChart(GANTT_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('Planning');
      expect(result.svg).toContain('Development');
    });

    it('should handle progress indicators', () => {
      const result = renderGanttChart(GANTT_DATA, theme);
      expect(result.success).toBe(true);
      // Should render progress overlay with CSS variables for dynamic theming
      expect(result.svg).toContain('var(--scale-4)');
      expect(result.svg).toContain('fill-opacity="0.4"');
    });

    it('should handle empty data', () => {
      const result = renderGanttChart([], theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });
  });

  describe('renderQuadrantChart', () => {
    it('should render valid quadrant chart', () => {
      const result = renderQuadrantChart(QUADRANT_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should show data point labels', () => {
      const result = renderQuadrantChart(QUADRANT_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('Item A');
      expect(result.svg).toContain('Item B');
    });

    it('should apply custom quadrant labels', () => {
      const result = renderQuadrantChart(QUADRANT_DATA, theme, {
        quadrantLabels: ['High Priority', 'Schedule', 'Low Priority', 'Eliminate']
      });
      expect(result.success).toBe(true);
      expect(result.svg).toContain('High Priority');
    });

    it('should handle empty data', () => {
      const result = renderQuadrantChart([], theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });
  });

  describe('renderD3Chart (routing)', () => {
    it('should route to correct chart type', () => {
      const barResult = renderD3Chart('bar', BAR_DATA, theme);
      expect(barResult.success).toBe(true);

      const pieResult = renderD3Chart('pie', PIE_DATA, theme);
      expect(pieResult.success).toBe(true);

      const lineResult = renderD3Chart('line', LINE_DATA, theme);
      expect(lineResult.success).toBe(true);
    });

    it('should handle donut as pie variant', () => {
      const result = renderD3Chart('donut', PIE_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should handle area as line variant', () => {
      const result = renderD3Chart('area', LINE_DATA, theme);
      expect(result.success).toBe(true);
      expect(result.svg).toContain('<svg');
    });

    it('should return error for unknown chart type', () => {
      const result = renderD3Chart('unknown' as any, [], theme);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown chart type');
      expect(result.svg).toContain('<svg'); // Error SVG
    });
  });
});
