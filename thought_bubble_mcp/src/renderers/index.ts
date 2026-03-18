/**
 * Renderer Exports
 */

// Mermaid renderer
export {
  renderMermaidDiagram,
  renderMermaidDiagrams,
  renderMermaidToAscii,
  validateMermaidSyntax,
  isMermaidDiagramType,
  type MermaidDiagramType,
  type MermaidRenderOptions,
  type MermaidRenderResult,
} from './mermaid_renderer.js';

// D3 renderer
export {
  renderD3Chart,
  renderBarChart,
  renderPieChart,
  renderLineChart,
  renderGanttChart,
  renderTimelineChart,
  renderQuadrantChart,
  isD3ChartType,
  type D3ChartType,
  type BarChartData,
  type PieChartData,
  type LineChartData,
  type GanttChartData,
  type TimelineData,
  type QuadrantData,
  type ChartOptions,
  type D3RenderResult,
} from './d3_renderer.js';

// Data transformation and validation
export {
  transformChartData,
  validateBarChartData,
  validatePieChartData,
  validateLineChartData,
  validateTimelineData,
  getValidatorForChartType,
  type ChartDataUnion,
} from './data_transformer.js';
