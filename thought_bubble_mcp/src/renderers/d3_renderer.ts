/**
 * D3 Chart Renderer
 * 
 * Server-side D3 chart rendering using jsdom.
 * Provides chart types that complement Mermaid diagrams:
 * - Bar charts
 * - Pie/Donut charts
 * - Line/Area charts
 * - Gantt charts
 * - Timeline charts
 * - Quadrant charts
 */

import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, type SankeyNode, type SankeyLink } from 'd3-sankey';
import { JSDOM } from 'jsdom';
import type { ThemeTokens } from '../themes/types.js';
import { processSvgForDynamicTheming } from '../themes/svg_processor.js';

/**
 * Derive a lighter or darker opaque hex from a base hex.
 * amount > 0 lightens (towards white), amount < 0 darkens (towards black).
 * Keeps gradients fully opaque — no transparency-induced pastel wash.
 */
function shiftColor(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  const nr = clamp(amount > 0 ? r + (255 - r) * amount : r * (1 + amount));
  const ng = clamp(amount > 0 ? g + (255 - g) * amount : g * (1 + amount));
  const nb = clamp(amount > 0 ? b + (255 - b) * amount : b * (1 + amount));
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
}

/**
 * D3 chart types supported
 */
export type D3ChartType =
  | 'bar'
  | 'pie'
  | 'donut'
  | 'line'
  | 'area'
  | 'gantt'
  | 'timeline'
  | 'quadrant'
  | 'sankey'
  | 'radial'
  | 'treemap';

/**
 * Check if a diagram type is a D3 chart type
 */
export function isD3ChartType(type: string): type is D3ChartType {
  return ['bar', 'pie', 'donut', 'line', 'area', 'gantt', 'timeline', 'quadrant', 'sankey', 'radial', 'treemap'].includes(type);
}

/**
 * Data structures for different chart types
 */
export interface BarChartData {
  label: string;
  value: number;
}

export interface PieChartData {
  label: string;
  value: number;
}

export interface LineChartData {
  x: number | Date | string;
  y: number;
  series?: string;
}

export interface GanttChartData {
  task: string;
  start: Date | string;
  end: Date | string;
  category?: string;
  progress?: number;
}

export interface TimelineData {
  event: string;
  date: Date | string;
  description?: string;
}

export interface QuadrantData {
  label: string;
  x: number;
  y: number;
}

export interface SankeyInputData {
  nodes: Array<{ id: string; label?: string }>;
  links: Array<{ source: string; target: string; value: number }>;
}

export interface TreemapInputData {
  label: string;
  value?: number;
  children?: TreemapInputData[];
}

/**
 * Annotation configuration for charts
 */
export interface ChartAnnotation {
  dataIndex?: number;
  x?: number | string;
  y?: number;
  label: string;
  type?: 'callout' | 'highlight' | 'marker';
  color?: string;
  dx?: number;
  dy?: number;
}

/**
 * Chart rendering options
 */
export interface ChartOptions {
  width?: number;
  height?: number;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  /** Annotations to add to the chart */
  annotations?: ChartAnnotation[];
  /** Label strategy for pie/donut charts: 'legend' (default), 'slices', or 'both' */
  labelStrategy?: 'legend' | 'slices' | 'both';
  emphasis?: 'glow' | 'shadow' | 'lift' | 'none';
  curve?: 'smooth' | 'sharp' | 'step' | 'natural';
  animation?: 'stagger' | 'draw' | 'grow' | 'fade' | 'none';
  colorStrategy?: 'categorical' | 'sequential' | 'diverging' | 'monochrome';
  patterns?: boolean;
}

/**
 * Result of rendering a chart
 */
export interface D3RenderResult {
  svg: string;
  success: boolean;
  error?: string;
}

/**
 * Create a virtual DOM for D3 rendering
 */
function createVirtualDOM(): { document: Document; body: d3.Selection<HTMLElement, unknown, null, undefined> } {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  const document = dom.window.document;
  const body = d3.select(document.body);
  return { document, body };
}

/**
 * Get the font family string for a theme
 */
function getThemeFontFamily(_theme: ThemeTokens, role: 'display' | 'body' | 'mono' = 'body'): string {
  // Return a CSS custom property reference so SVG text elements respond to
  // theme switching via data-theme. Must be applied via .style() not .attr()
  // since CSS vars only resolve in inline style contexts, not SVG attributes.
  return `var(--font-${role})`;
}

/**
 * Generate an SVG path for a rectangle with only the top corners rounded.
 * Bottom corners remain square so bars sit flush against the axis.
 */
function roundedTopRect(x: number, y: number, width: number, height: number, radius: number): string {
  const r = Math.min(radius, width / 2, height);
  if (r <= 0 || height <= 0 || width <= 0) {
    return `M${x},${y}H${x + width}V${y + height}H${x}Z`;
  }
  return [
    `M${x},${y + height}`,
    `V${y + r}`,
    `A${r},${r} 0 0 1 ${x + r},${y}`,
    `H${x + width - r}`,
    `A${r},${r} 0 0 1 ${x + width},${y + r}`,
    `V${y + height}`,
    `Z`
  ].join('');
}

/**
 * Create gradient definitions for charts
 * Adds reusable gradient definitions to an SVG defs element
 */
function createGradientDefs(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  theme: ThemeTokens,
  colors: string[]
): d3.Selection<SVGDefsElement, unknown, null, undefined> {
  const defs = svg.append('defs');
  
  // Dark themes: top slightly lighter → bottom full color (upward lift)
  // Light themes: top full color → bottom slightly darker (grounded base)
  const isDark = theme.mode === 'dark';

  colors.forEach((color, i) => {
    const barGradient = defs.append('linearGradient')
      .attr('id', `bar-gradient-${i}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    const topColor = isDark ? shiftColor(color, 0.18) : color;
    const bottomColor = isDark ? color : shiftColor(color, -0.18);

    barGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', topColor)
      .attr('stop-opacity', 1);

    barGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', bottomColor)
      .attr('stop-opacity', 1);
  });

  // Emphasis gradient for max-bar distinction
  const maxGradient = defs.append('linearGradient')
    .attr('id', 'bar-gradient-max')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');

  const accentTop = isDark ? shiftColor(theme.core.accent, 0.22) : theme.core.accent;
  const accentBottom = isDark ? theme.core.accent : shiftColor(theme.core.accent, -0.22);

  maxGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', accentTop)
    .attr('stop-opacity', 1);

  maxGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', accentBottom)
    .attr('stop-opacity', 1);
  
  // Create area chart gradient (accent color fade)
  const areaGradient = defs.append('linearGradient')
    .attr('id', 'area-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');
  
  areaGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', theme.core.accent)
    .attr('stop-opacity', 0.4);
  
  areaGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', theme.core.accent)
    .attr('stop-opacity', 0.05);
  
  // Create drop shadow filter
  const dropShadow = defs.append('filter')
    .attr('id', 'drop-shadow')
    .attr('height', '130%')
    .attr('width', '130%');
  
  dropShadow.append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 2)
    .attr('stdDeviation', 3)
    .attr('flood-color', theme.ui.shadow)
    .attr('flood-opacity', 0.5);
  
  // Create line glow filter
  const lineGlow = defs.append('filter')
    .attr('id', 'line-glow')
    .attr('height', '200%')
    .attr('width', '200%')
    .attr('x', '-50%')
    .attr('y', '-50%');
  
  lineGlow.append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', 4)
    .attr('result', 'blur');
  
  lineGlow.append('feMerge')
    .selectAll('feMergeNode')
    .data(['blur', 'SourceGraphic'])
    .enter()
    .append('feMergeNode')
    .attr('in', d => d);

  createFilters(defs, theme);
  createPatterns(defs, theme);

  return defs;
}

/**
 * Register reusable SVG filters: glow, premium glow, inner shadow.
 */
function createFilters(
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
  theme: ThemeTokens
): void {
  const glow = defs.append('filter')
    .attr('id', 'tb-glow')
    .attr('height', '200%').attr('width', '200%')
    .attr('x', '-50%').attr('y', '-50%');
  glow.append('feGaussianBlur')
    .attr('in', 'SourceGraphic').attr('stdDeviation', 3.5).attr('result', 'blur');
  const glowMerge = glow.append('feMerge');
  glowMerge.append('feMergeNode').attr('in', 'blur');
  glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  const premium = defs.append('filter')
    .attr('id', 'tb-glow-premium')
    .attr('height', '300%').attr('width', '300%')
    .attr('x', '-100%').attr('y', '-100%');
  premium.append('feGaussianBlur')
    .attr('in', 'SourceGraphic').attr('stdDeviation', 2).attr('result', 'blur-tight');
  premium.append('feGaussianBlur')
    .attr('in', 'SourceGraphic').attr('stdDeviation', 6).attr('result', 'blur-wide');
  const premiumMerge = premium.append('feMerge');
  premiumMerge.append('feMergeNode').attr('in', 'blur-wide');
  premiumMerge.append('feMergeNode').attr('in', 'blur-tight');
  premiumMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  const inner = defs.append('filter')
    .attr('id', 'tb-inner-shadow')
    .attr('height', '200%').attr('width', '200%')
    .attr('x', '-50%').attr('y', '-50%');
  inner.append('feGaussianBlur')
    .attr('in', 'SourceAlpha').attr('stdDeviation', 3).attr('result', 'blur');
  inner.append('feOffset')
    .attr('in', 'blur').attr('dx', 0).attr('dy', 2).attr('result', 'offsetBlur');
  inner.append('feComposite')
    .attr('in', 'offsetBlur').attr('in2', 'SourceAlpha')
    .attr('operator', 'arithmetic')
    .attr('k2', -1).attr('k3', 1).attr('result', 'innerShadow');
  const innerMerge = inner.append('feMerge');
  innerMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  innerMerge.append('feMergeNode').attr('in', 'innerShadow');
}

/**
 * Register 5 SVG pattern fills for accessibility (WCAG).
 * Colour must never be the sole differentiator.
 */
function createPatterns(
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
  theme: ThemeTokens
): void {
  const stroke = theme.ui.border;

  const dots = defs.append('pattern')
    .attr('id', 'tb-pattern-dots').attr('width', 8).attr('height', 8)
    .attr('patternUnits', 'userSpaceOnUse');
  dots.append('circle').attr('cx', 4).attr('cy', 4).attr('r', 1.5).attr('fill', stroke);

  const stripes = defs.append('pattern')
    .attr('id', 'tb-pattern-stripes').attr('width', 8).attr('height', 8)
    .attr('patternUnits', 'userSpaceOnUse');
  stripes.append('line')
    .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 8)
    .attr('stroke', stroke).attr('stroke-width', 2);

  const grid = defs.append('pattern')
    .attr('id', 'tb-pattern-grid').attr('width', 10).attr('height', 10)
    .attr('patternUnits', 'userSpaceOnUse');
  grid.append('line')
    .attr('x1', 0).attr('y1', 0).attr('x2', 10).attr('y2', 0)
    .attr('stroke', stroke).attr('stroke-width', 0.5);
  grid.append('line')
    .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 10)
    .attr('stroke', stroke).attr('stroke-width', 0.5);

  const crosshatch = defs.append('pattern')
    .attr('id', 'tb-pattern-crosshatch').attr('width', 8).attr('height', 8)
    .attr('patternUnits', 'userSpaceOnUse');
  crosshatch.append('line')
    .attr('x1', 0).attr('y1', 0).attr('x2', 8).attr('y2', 8)
    .attr('stroke', stroke).attr('stroke-width', 1);
  crosshatch.append('line')
    .attr('x1', 8).attr('y1', 0).attr('x2', 0).attr('y2', 8)
    .attr('stroke', stroke).attr('stroke-width', 1);

  const diagonal = defs.append('pattern')
    .attr('id', 'tb-pattern-diagonal').attr('width', 8).attr('height', 8)
    .attr('patternUnits', 'userSpaceOnUse');
  diagonal.append('line')
    .attr('x1', 0).attr('y1', 0).attr('x2', 8).attr('y2', 8)
    .attr('stroke', stroke).attr('stroke-width', 1.5);
}

/**
 * Map intent labels to D3 curve factories.
 */
function getCurveFactory(curveName?: string): d3.CurveFactory {
  switch (curveName) {
    case 'smooth':  return d3.curveMonotoneX;
    case 'natural': return d3.curveCatmullRom;
    case 'sharp':   return d3.curveLinear;
    case 'step':    return d3.curveStep;
    default:        return d3.curveMonotoneX;
  }
}

/**
 * Colour strategy selector. Returns a function mapping data index to colour.
 */
function getColorScale(
  strategy: string | undefined,
  data: any[],
  theme: ThemeTokens
): (i: number) => string {
  const n = data.length || 1;
  switch (strategy) {
    case 'sequential': {
      const seq = theme.scales.sequential;
      return (i: number) => seq[Math.min(Math.floor((i / n) * seq.length), seq.length - 1)];
    }
    case 'diverging': {
      const div = theme.scales.diverging;
      return (i: number) => div[Math.min(Math.floor((i / n) * div.length), div.length - 1)];
    }
    case 'monochrome': {
      const base = theme.core.accent;
      return (i: number) => {
        const t = n > 1 ? i / (n - 1) : 0;
        return shiftColor(base, 0.4 - t * 0.6);
      };
    }
    case 'categorical':
    default: {
      const pal = theme.scales.primary;
      return (i: number) => pal[i % pal.length];
    }
  }
}

/**
 * Double-render text with background stroke for readability over data.
 */
function addLabelWithOutline(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  text: string,
  x: number,
  y: number,
  theme: ThemeTokens,
  fontSize: string = '12px'
): void {
  group.append('text')
    .attr('x', x).attr('y', y).attr('text-anchor', 'middle')
    .attr('fill', 'none')
    .attr('stroke', theme.core.bg).attr('stroke-width', 3)
    .attr('stroke-linejoin', 'round')
    .style('font-family', getThemeFontFamily(theme, 'mono'))
    .attr('font-size', fontSize).attr('font-weight', '600')
    .text(text);
  group.append('text')
    .attr('x', x).attr('y', y).attr('text-anchor', 'middle')
    .attr('fill', theme.core.fg)
    .style('font-family', getThemeFontFamily(theme, 'mono'))
    .attr('font-size', fontSize).attr('font-weight', '600')
    .text(text);
}

/**
 * Wrap text to fit within maxWidth
 * Uses approximate character width since getComputedTextLength() isn't available in jsdom
 */
function wrapText(
  textSelection: d3.Selection<SVGTextElement, any, any, any>,
  maxWidth: number
): void {
  textSelection.each(function() {
    const text = d3.select(this);
    const textContent = text.text();
    const words = textContent.split(/\s+/).reverse();
    const lineHeight = 1.1; // ems
    const y = text.attr('y');
    const x = text.attr('x');
    const dy = parseFloat(text.attr('dy') || '0');
    const avgCharWidth = 7; // Approximate character width in pixels for 12px font
    
    let word;
    let line: string[] = [];
    let lineNumber = 0;
    let tspan = text.text(null).append('tspan')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em');
    
    while (word = words.pop()) {
      line.push(word);
      const lineText = line.join(' ');
      tspan.text(lineText);
      
      // Approximate text width (works in server-side rendering)
      const approximateWidth = lineText.length * avgCharWidth;
      
      if (approximateWidth > maxWidth) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', ++lineNumber * lineHeight + dy + 'em')
          .text(word);
      }
    }
  });
}

/**
 * Label bounds for collision detection
 */
interface LabelBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if two label bounds overlap
 */
function hasCollision(a: LabelBounds, b: LabelBounds): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

/**
 * Calculate smart label positions to avoid overlaps in timeline
 */
function calculateSmartLabelPositions(
  events: Array<{ x: number; text: string }>,
  alternateStartY: number,
  spacing: number
): LabelBounds[] {
  const bounds: LabelBounds[] = [];
  const labelHeight = 60;
  const minTextWidth = 100;
  const avgCharWidth = 8; // Slightly wider estimate for safety
  
  events.forEach((event, i) => {
    // Approximate text width with padding for safety
    const textWidth = Math.max(event.text.length * avgCharWidth + 20, minTextWidth);
    
    // Start with alternating top/bottom
    let y = i % 2 === 0 ? alternateStartY : alternateStartY + spacing;
    let testBounds: LabelBounds = {
      x: event.x - textWidth / 2,
      y,
      width: textWidth,
      height: labelHeight
    };
    
    // Adjust position if collision detected (max 5 attempts)
    let attempts = 0;
    while (bounds.some(b => hasCollision(testBounds, b)) && attempts < 5) {
      // Move up if on top row, down if on bottom row
      y += (i % 2 === 0 ? -30 : 30);
      testBounds = {
        x: event.x - textWidth / 2,
        y,
        width: textWidth,
        height: labelHeight
      };
      attempts++;
    }
    
    bounds.push(testBounds);
  });
  
  return bounds;
}

/**
 * Standard SVG setup with theme
 */
function createSvg(
  body: d3.Selection<HTMLElement, unknown, null, undefined>,
  width: number,
  height: number,
  theme: ThemeTokens
): d3.Selection<SVGSVGElement, unknown, null, undefined> {
  return body.append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('font-family', getThemeFontFamily(theme, 'body'));
  // No background: SVGs are transparent by default and inherit their
  // container's surface colour. Baking a background here creates a
  // visible seam when the container uses --surface and the SVG uses --bg.
}

/**
 * Render a bar chart
 */
export function renderBarChart(
  data: BarChartData[],
  theme: ThemeTokens,
  options: ChartOptions = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    const width = options.width ?? 600;
    const height = options.height ?? 400;
    const margin = { top: 50, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);
    
    // Create gradient definitions
    createGradientDefs(svg, theme, theme.scales.primary);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.35);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Determine max-bar for emphasis (only when no explicit annotations)
    const hasUserAnnotations = options.annotations && options.annotations.length > 0;
    const maxValue = d3.max(data, d => d.value) || 0;
    const maxIndex = data.findIndex(d => d.value === maxValue);
    const cornerRadius = 4;

    // Map each bar label to an index into theme.scales.primary so categorical
    // bar charts (different disciplines, functions, states, etc.) get distinct
    // colours from the theme palette. Time-series bars would share one colour
    // but BarChartData has no series/time field to distinguish — categorical
    // distinction is the correct default for this type.
    const colorFn = getColorScale(options.colorStrategy, data, theme);
    const useCategoricalGradients = !options.colorStrategy || options.colorStrategy === 'categorical';

    // Grid lines (subtle)
    if (options.showGrid !== false) {
      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', theme.ui.border)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', '2,4');

      g.selectAll('.grid .domain').remove();
    }

    // Bars: path elements with rounded top corners
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'bar')
      .attr('d', d => roundedTopRect(
        xScale(d.label) || 0,
        yScale(d.value),
        xScale.bandwidth(),
        innerHeight - yScale(d.value),
        cornerRadius
      ))
      .attr('fill', (d, i) => {
        if (!hasUserAnnotations && i === maxIndex && data.length > 1) {
          return 'url(#bar-gradient-max)';
        }
        if (useCategoricalGradients) {
          return `url(#bar-gradient-${i % theme.scales.primary.length})`;
        }
        return colorFn(i);
      })
      .attr('filter', (_, i) => {
        if (options.emphasis === 'glow' && !hasUserAnnotations && i === maxIndex && data.length > 1) {
          return 'url(#tb-glow)';
        }
        return 'url(#drop-shadow)';
      })
      .style('cursor', 'pointer');

    if (options.patterns) {
      const patternNames = ['dots', 'stripes', 'grid', 'crosshatch', 'diagonal'];
      g.selectAll('.pattern-overlay')
        .data(data)
        .enter()
        .append('path')
        .attr('d', d => roundedTopRect(
          xScale(d.label) || 0,
          yScale(d.value),
          xScale.bandwidth(),
          innerHeight - yScale(d.value),
          cornerRadius
        ))
        .attr('fill', (_, i) => `url(#tb-pattern-${patternNames[i % patternNames.length]})`)
        .attr('opacity', 0.4)
        .attr('pointer-events', 'none');
    }

    // X axis
    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxisGroup.selectAll('text')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px')
      .style('font-family', getThemeFontFamily(theme, 'body'));

    g.selectAll('.domain, .tick line').attr('stroke', theme.core.muted);

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px')
      .style('font-family', getThemeFontFamily(theme, 'body'));

    // Title (using display font)
    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    // Value labels (using mono font for data)
    g.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.core.fg)
      .style('font-family', getThemeFontFamily(theme, 'mono'))
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text(d => d.value);

    // Max-bar annotation (only when no explicit annotations and more than 1 bar)
    if (!hasUserAnnotations && data.length > 1 && maxIndex >= 0) {
      const maxItem = data[maxIndex];
      const labelX = (xScale(maxItem.label) || 0) + xScale.bandwidth() / 2;
      const labelY = yScale(maxItem.value) - 26;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.accent)
        .style('font-family', getThemeFontFamily(theme, 'body'))
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '0.04em')
        .text('HIGHEST');
    }

    // Post-process SVG for dynamic theming
    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'bar'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a pie or donut chart
 */
export function renderPieChart(
  data: PieChartData[],
  theme: ThemeTokens,
  options: ChartOptions & { donut?: boolean } = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    
    const labelStrategy = options.labelStrategy || 'legend';
    
    const width = options.width ?? 500;
    // Reserve vertical space below the chart for the legend
    const legendRows = (labelStrategy === 'legend' || labelStrategy === 'both') ? data.length : 0;
    const legendHeight = legendRows > 0 ? 30 + legendRows * 22 : 0;
    const chartHeight = options.height ?? 380;
    const height = chartHeight + legendHeight;
    const radius = Math.min(width, chartHeight) / 2 - 40;
    const innerRadius = options.donut ? radius * 0.5 : 0;

    const svg = createSvg(body, width, height, theme);
    
    // Create shadow filter for the whole pie
    const defs = svg.append('defs');
    const dropShadow = defs.append('filter')
      .attr('id', 'pie-shadow')
      .attr('height', '130%')
      .attr('width', '130%');
    
    dropShadow.append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 4)
      .attr('stdDeviation', 6)
      .attr('flood-color', theme.ui.shadow)
      .attr('flood-opacity', 0.3);

    if (options.patterns) {
      createPatterns(defs, theme);
    }

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${chartHeight / 2 + (options.title ? 15 : 0)})`)
      .attr('filter', 'url(#pie-shadow)');

    const colorFn = getColorScale(options.colorStrategy, data, theme);
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(data.map((_, i) => colorFn(i)));

    const pie = d3.pie<PieChartData>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4);

    const labelArc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    // Slices with stroke separation
    g.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('class', 'pie-slice')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.label))
      .attr('stroke', theme.core.bg)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    if (options.patterns) {
      const patternNames = ['dots', 'stripes', 'grid', 'crosshatch', 'diagonal'];
      g.selectAll('.pattern-overlay')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (_, i) => `url(#tb-pattern-${patternNames[i % patternNames.length]})`)
        .attr('opacity', 0.4)
        .attr('pointer-events', 'none');
    }

    // Slice Labels (only if strategy allows)
    if (labelStrategy === 'slices' || labelStrategy === 'both') {
      g.selectAll('.label')
        .data(pie(data))
        .enter()
        .append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .text(d => {
          // Only show label if slice is large enough (> 5% of total)
          const percentage = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
          return percentage > 5 ? d.data.label : '';
        });
    }

    // Title (using display font)
    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    // Legend below the chart (centred, multi-column for many items)
    if ((labelStrategy === 'legend' || labelStrategy === 'both') && options.showLegend !== false) {
      const legendTop = chartHeight + 10;
      const itemWidth = 140;
      const cols = Math.max(1, Math.floor(width / itemWidth));
      const startX = (width - Math.min(data.length, cols) * itemWidth) / 2;
      
      const legend = svg.append('g')
        .attr('transform', `translate(${startX}, ${legendTop})`);

      data.forEach((d, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        const legendRow = legend.append('g')
          .attr('transform', `translate(${col * itemWidth}, ${row * 22})`);

        legendRow.append('rect')
          .attr('width', 12)
          .attr('height', 12)
          .attr('rx', 3)
          .attr('fill', colorScale(d.label));

        legendRow.append('text')
          .attr('x', 18)
          .attr('y', 11)
          .attr('fill', theme.core.fg)
          .attr('font-size', '12px')
          .style('font-family', getThemeFontFamily(theme, 'body'))
          .text(d.label);
      });
    }

    // Post-process SVG for dynamic theming
    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'pie'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a line or area chart
 */
export function renderLineChart(
  data: LineChartData[],
  theme: ThemeTokens,
  options: ChartOptions & { area?: boolean } = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    const width = options.width ?? 700;
    const height = options.height ?? 400;
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);
    
    // Create gradient definitions
    createGradientDefs(svg, theme, theme.scales.primary);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Determine X-axis type: date, numeric, or categorical (string labels)
    const firstX = data[0]?.x;
    const isNumeric = typeof firstX === 'number';
    const isValidDate = typeof firstX === 'string' && !isNaN(Date.parse(firstX)) && 
                        firstX.match(/^\d{4}(-\d{2})?(-\d{2})?/) !== null; // ISO date pattern
    const isCategorical = typeof firstX === 'string' && !isValidDate;

    // Create appropriate scale based on data type
    let xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.ScalePoint<string>;
    let getX: (d: LineChartData) => number;

    if (isCategorical) {
      // Categorical string labels (e.g., 'Jan', 'W1', '0s', 'Sprint 1')
      const labels = data.map(d => String(d.x));
      xScale = d3.scalePoint<string>()
        .domain(labels)
        .range([0, innerWidth])
        .padding(0.5);
      getX = (d: LineChartData) => (xScale as d3.ScalePoint<string>)(String(d.x)) ?? 0;
    } else if (isValidDate) {
      // Date strings (ISO format)
      const dateValues = data.map(d => new Date(d.x as string));
      xScale = d3.scaleTime()
        .domain(d3.extent(dateValues) as [Date, Date])
        .range([0, innerWidth]);
      getX = (d: LineChartData) => (xScale as d3.ScaleTime<number, number>)(new Date(d.x as string));
    } else {
      // Numeric values
      const numValues = data.map(d => d.x as number);
      xScale = d3.scaleLinear()
        .domain(d3.extent(numValues) as [number, number])
        .range([0, innerWidth]);
      getX = (d: LineChartData) => (xScale as d3.ScaleLinear<number, number>)(d.x as number);
    }

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Grid (subtle, dashed)
    if (options.showGrid !== false) {
      g.append('g')
        .call(d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => ''))
        .selectAll('line')
        .attr('stroke', theme.ui.border)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', '2,4');

      g.selectAll('.domain').remove();
    }

    const curveFactory = getCurveFactory(options.curve);

    const line = d3.line<LineChartData>()
      .x(d => getX(d))
      .y(d => yScale(d.y))
      .curve(curveFactory);

    if (options.area) {
      const area = d3.area<LineChartData>()
        .x(d => getX(d))
        .y0(innerHeight)
        .y1(d => yScale(d.y))
        .curve(curveFactory);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#area-gradient)')
        .attr('d', area);
    }

    // Glow effect line (behind main line)
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.core.accent)
      .attr('stroke-width', 8)
      .attr('stroke-opacity', 0.15)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line);

    // Main line with rounded caps
    const mainLine = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', theme.core.accent)
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line);

    if (options.emphasis === 'glow') {
      mainLine.attr('filter', 'url(#tb-glow)');
    }

    // Data points (hollow circles, filled on hover via CSS)
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => getX(d))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', theme.ui.surface)
      .attr('stroke', theme.core.accent)
      .attr('stroke-width', 2.5)
      .style('cursor', 'pointer');

    // X-Axis - handle categorical vs continuous scales differently
    const xAxisGroup = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`);
    
    if (isCategorical) {
      // For categorical data, use scalePoint axis
      xAxisGroup.call(d3.axisBottom(xScale as d3.ScalePoint<string>));
    } else {
      xAxisGroup.call(d3.axisBottom(xScale as any));
    }
    
    xAxisGroup.selectAll('text')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px');

    g.selectAll('.domain, .tick line').attr('stroke', theme.core.muted);

    // Title (using display font)
    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    // Post-process SVG for dynamic theming
    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'line'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a Gantt chart
 */
export function renderGanttChart(
  data: GanttChartData[],
  theme: ThemeTokens,
  options: ChartOptions = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    const width = options.width ?? 800;
    const barHeight = 32;
    const barPadding = 10;
    const height = options.height ?? (data.length * (barHeight + barPadding) + 120);
    const margin = { top: 60, right: 40, bottom: 50, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);
    
    // Create gradient definitions
    createGradientDefs(svg, theme, theme.scales.primary);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parsedData = data.map(d => ({
      ...d,
      start: typeof d.start === 'string' ? new Date(d.start) : d.start,
      end: typeof d.end === 'string' ? new Date(d.end) : d.end,
    }));

    // Scales
    const xExtent = [
      d3.min(parsedData, d => d.start)!,
      d3.max(parsedData, d => d.end)!
    ];

    const xScale = d3.scaleTime()
      .domain(xExtent)
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(parsedData.map(d => d.task))
      .range([0, innerHeight])
      .padding(0.25);

    // Map categories to color indices
    const categories = [...new Set(parsedData.map(d => d.category || 'default'))];
    const categoryIndexMap = new Map<string, number>();
    categories.forEach((cat, i) => {
      categoryIndexMap.set(cat, i % theme.scales.primary.length);
    });

    // Grid (subtle)
    g.append('g')
      .call(d3.axisBottom(xScale)
        .tickSize(innerHeight)
        .tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', theme.ui.border)
      .attr('stroke-opacity', 0.2)
      .attr('stroke-dasharray', '2,4');

    g.selectAll('.domain').remove();

    // Bars with gradient fills and rounded pill shape
    g.selectAll('.bar')
      .data(parsedData)
      .enter()
      .append('rect')
      .attr('class', 'gantt-bar')
      .attr('x', d => xScale(d.start))
      .attr('y', d => yScale(d.task) || 0)
      .attr('width', d => Math.max(xScale(d.end) - xScale(d.start), 4))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => `url(#bar-gradient-${categoryIndexMap.get(d.category || 'default') || 0})`)
      .attr('rx', 2)
      .attr('filter', 'url(#drop-shadow)')
      .style('cursor', 'pointer');

    // Progress overlay
    g.selectAll('.progress')
      .data(parsedData.filter(d => d.progress !== undefined))
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.start))
      .attr('y', d => yScale(d.task) || 0)
      .attr('width', d => (xScale(d.end) - xScale(d.start)) * (d.progress! / 100))
      .attr('height', yScale.bandwidth())
      .attr('fill', theme.semantic.success)
      .attr('fill-opacity', 0.4)
      .attr('rx', 2);

    // Y axis (task names)
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', theme.core.fg)
      .attr('font-size', '12px');

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px');

    g.selectAll('.domain, .tick line').attr('stroke', theme.core.muted);

    // Title (using display font)
    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 32)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    // Post-process SVG for dynamic theming
    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'gantt'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a quadrant/priority matrix chart
 */
export function renderQuadrantChart(
  data: QuadrantData[],
  theme: ThemeTokens,
  options: ChartOptions & { 
    quadrantLabels?: [string, string, string, string];
    xLabel?: string;
    yLabel?: string;
  } = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    const width = options.width ?? 600;
    const height = options.height ?? 600;
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Quadrant backgrounds
    const quadrantColors = [
      theme.scales.primary[0] + '20',
      theme.scales.primary[1] + '20',
      theme.scales.primary[2] + '20',
      theme.scales.primary[3] + '20',
    ];

    const quadrants = [
      { x: innerWidth / 2, y: 0 },           // Top-right
      { x: 0, y: 0 },                         // Top-left
      { x: 0, y: innerHeight / 2 },          // Bottom-left
      { x: innerWidth / 2, y: innerHeight / 2 }, // Bottom-right
    ];

    quadrants.forEach((q, i) => {
      g.append('rect')
        .attr('x', q.x)
        .attr('y', q.y)
        .attr('width', innerWidth / 2)
        .attr('height', innerHeight / 2)
        .attr('fill', quadrantColors[i]);
    });

    // Axes lines
    g.append('line')
      .attr('x1', innerWidth / 2)
      .attr('y1', 0)
      .attr('x2', innerWidth / 2)
      .attr('y2', innerHeight)
      .attr('stroke', theme.core.muted)
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', 0)
      .attr('y1', innerHeight / 2)
      .attr('x2', innerWidth)
      .attr('y2', innerHeight / 2)
      .attr('stroke', theme.core.muted)
      .attr('stroke-width', 2);

    // Auto-detect scale range from data with padding
    const xMax = d3.max(data, d => d.x) || 10;
    const yMax = d3.max(data, d => d.y) || 10;
    const scaleMax = Math.ceil(Math.max(xMax, yMax) * 1.15); // 15% padding, uniform scale
    
    const xScale = d3.scaleLinear().domain([0, scaleMax]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, scaleMax]).range([innerHeight, 0]);

    // Data points
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(theme.scales.primary);

    g.selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', d => colorScale(d.label))
      .attr('stroke', theme.core.bg)
      .attr('stroke-width', 2);

    // Labels
    g.selectAll('.point-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.x))
      .attr('y', d => yScale(d.y) - 14)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px')
      .text(d => d.label);

    // Quadrant labels
    const defaultLabels = ['Do First', 'Schedule', 'Delegate', 'Eliminate'];
    const labels = options.quadrantLabels || defaultLabels;
    const labelPositions = [
      { x: innerWidth * 0.75, y: innerHeight * 0.1 },
      { x: innerWidth * 0.25, y: innerHeight * 0.1 },
      { x: innerWidth * 0.25, y: innerHeight * 0.9 },
      { x: innerWidth * 0.75, y: innerHeight * 0.9 },
    ];

    labelPositions.forEach((pos, i) => {
      g.append('text')
        .attr('x', pos.x)
        .attr('y', pos.y)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.muted)
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .text(labels[i]);
    });

    // Axis labels
    if (options.xLabel) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.muted)
        .attr('font-size', '12px')
        .text(options.xLabel);
    }

    if (options.yLabel) {
      svg.append('text')
        .attr('transform', `rotate(-90)`)
        .attr('x', -height / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.muted)
        .attr('font-size', '12px')
        .text(options.yLabel);
    }

    // Title (using display font)
    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 32)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    // Post-process SVG for dynamic theming
    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'gantt'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a timeline chart
 */
export function renderTimelineChart(
  data: TimelineData[],
  theme: ThemeTokens,
  options: ChartOptions & { orientation?: 'horizontal' | 'vertical' } = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    const orientation = options.orientation || 'horizontal';
    // Scale width based on number of events to prevent crowding
    const baseWidth = Math.max(800, data.length * 160);
    const width = options.width ?? baseWidth;
    const height = options.height ?? (orientation === 'horizontal' ? 450 : 600);
    // Wider margins to prevent text cutoff at edges
    const margin = { top: 80, right: 100, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parsedData = data.map(d => ({
      ...d,
      date: typeof d.date === 'string' ? new Date(d.date) : d.date,
    }));

    // Sort by date
    parsedData.sort((a, b) => a.date.getTime() - b.date.getTime());

    const colorScale = d3.scaleOrdinal<string>()
      .domain(parsedData.map(d => d.event))
      .range(theme.scales.primary);

    if (orientation === 'horizontal') {
      // Horizontal timeline - add padding to domain so edge events aren't clipped
      const dateExtent = d3.extent(parsedData, d => d.date) as [Date, Date];
      const timeSpan = dateExtent[1].getTime() - dateExtent[0].getTime();
      const paddedStart = new Date(dateExtent[0].getTime() - timeSpan * 0.05);
      const paddedEnd = new Date(dateExtent[1].getTime() + timeSpan * 0.05);
      
      const xScale = d3.scaleTime()
        .domain([paddedStart, paddedEnd])
        .range([0, innerWidth]);

      // Draw timeline axis
      g.append('line')
        .attr('x1', 0)
        .attr('y1', innerHeight / 2)
        .attr('x2', innerWidth)
        .attr('y2', innerHeight / 2)
        .attr('stroke', theme.core.accent)
        .attr('stroke-width', 3);

      // Calculate smart label positions to avoid overlaps
      const eventPositions = parsedData.map((d, i) => ({
        x: xScale(d.date),
        text: d.event
      }));
      const labelBounds = calculateSmartLabelPositions(
        eventPositions,
        60, // top position
        160 // spacing between top and bottom
      );

      // Draw events with smart positioning
      parsedData.forEach((d, i) => {
        const x = xScale(d.date);
        const bounds = labelBounds[i];
        const isTop = i % 2 === 0;
        const y = bounds.y;
        const lineY = isTop ? innerHeight / 2 - 20 : innerHeight / 2 + 20;

        // Event marker (circle)
        g.append('circle')
          .attr('cx', x)
          .attr('cy', innerHeight / 2)
          .attr('r', 8)
          .attr('fill', colorScale(d.event))
          .attr('stroke', theme.core.bg)
          .attr('stroke-width', 3);

        // Connecting line
        g.append('line')
          .attr('x1', x)
          .attr('y1', innerHeight / 2)
          .attr('x2', x)
          .attr('y2', lineY)
          .attr('stroke', theme.core.muted)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4');

        // Event label with smart positioning
        g.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', 'middle')
          .attr('fill', theme.core.fg)
          .attr('font-size', '13px')
          .attr('font-weight', '600')
          .text(d.event);

        // Date label - validate date before displaying
        const dateText = d.date && !isNaN(d.date.getTime()) 
          ? d.date.toLocaleDateString() 
          : 'Invalid Date';
        
        g.append('text')
          .attr('x', x)
          .attr('y', y + 18)
          .attr('text-anchor', 'middle')
          .attr('fill', theme.core.muted)
          .attr('font-size', '11px')
          .text(dateText);

        // Description (if provided)
        if (d.description) {
          g.append('text')
            .attr('x', x)
            .attr('y', y + 34)
            .attr('text-anchor', 'middle')
            .attr('fill', theme.ui.textSecondary)
            .attr('font-size', '10px')
            .text(d.description.substring(0, 20) + (d.description.length > 20 ? '...' : ''));
        }
      });

      // X axis (dates)
      g.append('g')
        .attr('transform', `translate(0,${innerHeight - 10})`)
        .call(d3.axisBottom(xScale).ticks(6))
        .selectAll('text')
        .attr('fill', theme.core.muted)
        .attr('font-size', '10px');

      g.selectAll('.domain, .tick line').attr('stroke', theme.ui.border);

    } else {
      // Vertical timeline
      const yScale = d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
        .range([0, innerHeight]);

      // Draw timeline axis
      g.append('line')
        .attr('x1', innerWidth / 2)
        .attr('y1', 0)
        .attr('x2', innerWidth / 2)
        .attr('y2', innerHeight)
        .attr('stroke', theme.core.accent)
        .attr('stroke-width', 3);

      // Draw events
      parsedData.forEach((d, i) => {
        const y = yScale(d.date);
        const isLeft = i % 2 === 0;
        const x = isLeft ? innerWidth / 2 - 120 : innerWidth / 2 + 120;
        const lineX = isLeft ? innerWidth / 2 - 20 : innerWidth / 2 + 20;

        // Event marker (circle)
        g.append('circle')
          .attr('cx', innerWidth / 2)
          .attr('cy', y)
          .attr('r', 8)
          .attr('fill', colorScale(d.event))
          .attr('stroke', theme.core.bg)
          .attr('stroke-width', 3);

        // Connecting line
        g.append('line')
          .attr('x1', innerWidth / 2)
          .attr('y1', y)
          .attr('x2', lineX)
          .attr('y2', y)
          .attr('stroke', theme.core.muted)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4');

        // Event label
        g.append('text')
          .attr('x', x)
          .attr('y', y - 5)
          .attr('text-anchor', isLeft ? 'end' : 'start')
          .attr('fill', theme.core.fg)
          .attr('font-size', '13px')
          .attr('font-weight', '600')
          .text(d.event);

        // Date label
        g.append('text')
          .attr('x', x)
          .attr('y', y + 12)
          .attr('text-anchor', isLeft ? 'end' : 'start')
          .attr('fill', theme.core.muted)
          .attr('font-size', '11px')
          .text(d.date.toLocaleDateString());

        // Description (if provided)
        if (d.description) {
          g.append('text')
            .attr('x', x)
            .attr('y', y + 26)
            .attr('text-anchor', isLeft ? 'end' : 'start')
            .attr('fill', theme.ui.textSecondary)
            .attr('font-size', '10px')
            .text(d.description.substring(0, 30) + (d.description.length > 30 ? '...' : ''));
        }
      });

      // Y axis (dates)
      g.append('g')
        .attr('transform', `translate(10,0)`)
        .call(d3.axisLeft(yScale).ticks(8))
        .selectAll('text')
        .attr('fill', theme.core.muted)
        .attr('font-size', '10px');

      g.selectAll('.domain, .tick line').attr('stroke', theme.ui.border);
    }

    // Title (using display font)
    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 32)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    // Post-process SVG for dynamic theming
    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'timeline'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a Sankey diagram
 */
export function renderSankeyChart(
  data: SankeyInputData | SankeyInputData[],
  theme: ThemeTokens,
  options: ChartOptions = {}
): D3RenderResult {
  try {
    const sankeyData: SankeyInputData = Array.isArray(data) ? (data as any)[0] : data;
    if (!sankeyData?.nodes || !sankeyData?.links) {
      throw new Error('Sankey data must include nodes and links arrays');
    }

    const { document, body } = createVirtualDOM();
    const width = options.width ?? 800;
    const height = options.height ?? 500;
    const margin = { top: 50, right: 30, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const nodeMap = new Map<string, number>();
    sankeyData.nodes.forEach((n, i) => nodeMap.set(n.id, i));

    const sankeyNodes = sankeyData.nodes.map(n => ({ name: n.label || n.id }));
    const sankeyLinks = sankeyData.links
      .filter(l => nodeMap.has(l.source) && nodeMap.has(l.target))
      .map(l => ({
        source: nodeMap.get(l.source)!,
        target: nodeMap.get(l.target)!,
        value: l.value,
      }));

    const sankeyLayout = (d3Sankey as any)()
      .nodeWidth(20)
      .nodePadding(16)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    const graph = sankeyLayout({
      nodes: sankeyNodes.map(d => ({ ...d })),
      links: sankeyLinks.map(d => ({ ...d })),
    }) as any;

    const colorScale = d3.scaleOrdinal<string>()
      .domain(sankeyData.nodes.map(n => n.id))
      .range(theme.scales.primary);

    // Links
    g.append('g')
      .selectAll('path')
      .data(graph.links)
      .enter()
      .append('path')
      .attr('d', sankeyLinkHorizontal() as any)
      .attr('fill', 'none')
      .attr('stroke', (_d: any, i: number) => colorScale(sankeyData.nodes[(_d as any).source.index]?.id || String(i)))
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .style('cursor', 'pointer');

    // Nodes
    g.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .enter()
      .append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => Math.max(1, d.y1 - d.y0))
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (_d: any, i: number) => colorScale(sankeyData.nodes[i]?.id || String(i)))
      .attr('rx', 2);

    // Node labels
    g.append('g')
      .selectAll('text')
      .data(graph.nodes)
      .enter()
      .append('text')
      .attr('x', (d: any) => d.x0 < innerWidth / 2 ? d.x1 + 8 : d.x0 - 8)
      .attr('y', (d: any) => (d.y0 + d.y1) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => d.x0 < innerWidth / 2 ? 'start' : 'end')
      .attr('fill', theme.core.fg)
      .attr('font-size', '12px')
      .style('font-family', getThemeFontFamily(theme, 'body'))
      .text((d: any) => d.name);

    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '500')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'sankey'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a radial bar chart (circular bar layout)
 */
export function renderRadialBarChart(
  data: BarChartData[],
  theme: ThemeTokens,
  options: ChartOptions = {}
): D3RenderResult {
  try {
    const { document, body } = createVirtualDOM();
    const width = options.width ?? 500;
    const height = options.height ?? 500;
    const outerRadius = Math.min(width, height) / 2 - 50;
    const innerRadius = outerRadius * 0.3;

    const svg = createSvg(body, width, height, theme);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2 + (options.title ? 15 : 0)})`);

    const maxValue = d3.max(data, d => d.value) || 1;

    const angleScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, 2 * Math.PI])
      .padding(0.15);

    const radiusScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([innerRadius, outerRadius]);

    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.label))
      .range(theme.scales.primary);

    const arcGen = d3.arc<BarChartData>()
      .innerRadius(innerRadius)
      .outerRadius(d => radiusScale(d.value))
      .startAngle(d => angleScale(d.label) || 0)
      .endAngle(d => (angleScale(d.label) || 0) + angleScale.bandwidth())
      .cornerRadius(3);

    g.selectAll('.radial-bar')
      .data(data)
      .enter()
      .append('path')
      .attr('class', 'bar')
      .attr('d', arcGen as any)
      .attr('fill', d => colorScale(d.label))
      .attr('fill-opacity', 0.85)
      .style('cursor', 'pointer');

    // Labels around the outside
    g.selectAll('.radial-label')
      .data(data)
      .enter()
      .append('text')
      .attr('transform', d => {
        const angle = (angleScale(d.label) || 0) + angleScale.bandwidth() / 2;
        const r = outerRadius + 16;
        const x = r * Math.sin(angle);
        const y = -r * Math.cos(angle);
        const rotateDeg = (angle * 180 / Math.PI) - 90;
        const flip = angle > Math.PI;
        return `translate(${x},${y}) rotate(${flip ? rotateDeg - 180 : rotateDeg})`;
      })
      .attr('text-anchor', d => {
        const angle = (angleScale(d.label) || 0) + angleScale.bandwidth() / 2;
        return angle > Math.PI ? 'end' : 'start';
      })
      .attr('dy', '0.35em')
      .attr('fill', theme.core.fg)
      .attr('font-size', '11px')
      .style('font-family', getThemeFontFamily(theme, 'body'))
      .text(d => d.label);

    // Inner circle background
    g.append('circle')
      .attr('r', innerRadius)
      .attr('fill', theme.ui.surface)
      .attr('stroke', theme.ui.border)
      .attr('stroke-width', 1);

    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '500')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'radial'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Render a treemap chart
 */
export function renderTreemapChart(
  data: TreemapInputData | TreemapInputData[],
  theme: ThemeTokens,
  options: ChartOptions = {}
): D3RenderResult {
  try {
    const treeData: TreemapInputData = Array.isArray(data) ? { label: 'root', children: data as TreemapInputData[] } : data;

    const { document, body } = createVirtualDOM();
    const width = options.width ?? 700;
    const height = options.height ?? 450;
    const margin = { top: 50, right: 10, bottom: 10, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = createSvg(body, width, height, theme);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy<TreemapInputData>(treeData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap<TreemapInputData>()
      .size([innerWidth, innerHeight])
      .padding(3)
      .round(true)(root);

    const colorScale = d3.scaleOrdinal<string>()
      .range(theme.scales.primary);

    const leaves = root.leaves();

    // Cells
    const cell = g.selectAll('g')
      .data(leaves)
      .enter()
      .append('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    cell.append('rect')
      .attr('width', (d: any) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d: any) => Math.max(0, d.y1 - d.y0))
      .attr('fill', (d: any) => colorScale(d.data.label))
      .attr('fill-opacity', 0.8)
      .attr('rx', 3)
      .attr('stroke', theme.core.bg)
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Labels (only for cells large enough)
    cell.filter((d: any) => (d.x1 - d.x0) > 50 && (d.y1 - d.y0) > 25)
      .append('text')
      .attr('x', 6)
      .attr('y', 18)
      .attr('fill', theme.core.bg)
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .style('font-family', getThemeFontFamily(theme, 'body'))
      .text((d: any) => d.data.label);

    // Value labels
    cell.filter((d: any) => (d.x1 - d.x0) > 50 && (d.y1 - d.y0) > 40)
      .append('text')
      .attr('x', 6)
      .attr('y', 34)
      .attr('fill', theme.core.bg)
      .attr('fill-opacity', 0.7)
      .attr('font-size', '11px')
      .style('font-family', getThemeFontFamily(theme, 'mono'))
      .text((d: any) => d.value);

    if (options.title) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'display'))
        .attr('font-size', '18px')
        .attr('font-weight', '500')
        .attr('letter-spacing', '-0.02em')
        .text(options.title);
    }

    const rawSvg = body.html();
    return { svg: processSvgForDynamicTheming(rawSvg, theme), success: true };
  } catch (error) {
    return {
      svg: createErrorSvg(error instanceof Error ? error.message : 'Unknown error', theme, 'treemap'),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Annotation data structure
 */
export interface AnnotationData {
  x: number | string;
  y: number;
  label: string;
  type?: 'callout' | 'highlight' | 'marker';
  color?: string;
}

/**
 * Add annotations to a chart
 * Creates callout lines, highlight circles, and contextual labels
 */
function addAnnotations(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  annotations: AnnotationData[],
  theme: ThemeTokens,
  xScale: any,
  yScale: d3.ScaleLinear<number, number>
): void {
  const annotationGroup = g.append('g')
    .attr('class', 'annotations');

  annotations.forEach((annotation, i) => {
    const x = typeof annotation.x === 'number' ? annotation.x : xScale(annotation.x);
    const y = yScale(annotation.y);
    const color = annotation.color || theme.semantic.success;
    const type = annotation.type || 'callout';

    if (type === 'callout') {
      // Determine callout direction (alternate above/below)
      const isAbove = i % 2 === 0;
      const lineEndY = isAbove ? y - 50 : y + 50;
      const labelY = isAbove ? lineEndY - 8 : lineEndY + 16;

      // Callout line (dashed)
      annotationGroup.append('line')
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', x + 40)
        .attr('y2', lineEndY)
        .attr('stroke', theme.core.muted)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,3');

      // Highlight circle around data point
      annotationGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 12)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2');

      // Label text
      annotationGroup.append('text')
        .attr('x', x + 45)
        .attr('y', labelY)
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'body'))
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .text(annotation.label);
    } else if (type === 'highlight') {
      // Just a highlight circle with label inside
      annotationGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 20)
        .attr('fill', color)
        .attr('fill-opacity', 0.15)
        .attr('stroke', color)
        .attr('stroke-width', 2);

      annotationGroup.append('text')
        .attr('x', x)
        .attr('y', y + 4)
        .attr('text-anchor', 'middle')
        .attr('fill', color)
        .style('font-family', getThemeFontFamily(theme, 'mono'))
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(annotation.label);
    } else if (type === 'marker') {
      // Small marker with label above
      annotationGroup.append('line')
        .attr('x1', x)
        .attr('y1', y - 5)
        .attr('x2', x)
        .attr('y2', y - 25)
        .attr('stroke', color)
        .attr('stroke-width', 2);

      annotationGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y - 25)
        .attr('r', 4)
        .attr('fill', color);

      annotationGroup.append('text')
        .attr('x', x)
        .attr('y', y - 35)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.core.fg)
        .style('font-family', getThemeFontFamily(theme, 'body'))
        .attr('font-size', '11px')
        .text(annotation.label);
    }
  });
}

/**
 * Create an error SVG placeholder
 */
function createErrorSvg(message: string, theme: ThemeTokens, chartType?: D3ChartType): string {
  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Generate helpful data structure hint based on chart type
  let dataHint = '';
  if (chartType === 'bar' || chartType === 'pie' || chartType === 'donut' || chartType === 'radial') {
    dataHint = 'Expected: [{label: string, value: number}, ...]';
  } else if (chartType === 'line' || chartType === 'area') {
    dataHint = 'Expected: [{x: number|string, y: number}, ...]';
  } else if (chartType === 'timeline') {
    dataHint = 'Expected: [{event: string, date: Date|string}, ...]';
  } else if (chartType === 'gantt') {
    dataHint = 'Expected: [{task: string, start: Date, end: Date}, ...]';
  } else if (chartType === 'quadrant') {
    dataHint = 'Expected: [{label: string, x: number, y: number}, ...]';
  } else if (chartType === 'sankey') {
    dataHint = 'Expected: {nodes: [{id, label}], links: [{source, target, value}]}';
  } else if (chartType === 'treemap') {
    dataHint = 'Expected: [{label: string, value: number, children?: [...]}]';
  }

  const escapedHint = dataHint
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="240" viewBox="0 0 500 240">
  <rect width="500" height="240" fill="${theme.core.bg}" rx="8"/>
  <rect x="10" y="10" width="480" height="220" fill="${theme.ui.surface}" stroke="${theme.semantic.error}" stroke-width="2" rx="6"/>
  <text x="250" y="70" text-anchor="middle" fill="${theme.semantic.error}" font-family="Inter, system-ui, sans-serif" font-size="16" font-weight="600">
    Chart Rendering Error
  </text>
  <text x="250" y="110" text-anchor="middle" fill="${theme.core.muted}" font-family="Inter, system-ui, sans-serif" font-size="12">
    ${escapedMessage.substring(0, 60)}${escapedMessage.length > 60 ? '...' : ''}
  </text>
  ${dataHint ? `<text x="250" y="160" text-anchor="middle" fill="${theme.core.muted}" font-family="'Courier New', monospace" font-size="11" font-weight="500">
    ${escapedHint}
  </text>` : ''}
  <text x="250" y="195" text-anchor="middle" fill="${theme.core.muted}" font-family="Inter, system-ui, sans-serif" font-size="10">
    Check the data structure and ensure all required fields are present
  </text>
</svg>`;
}

/**
 * Main render function that routes to appropriate chart type
 */
export function renderD3Chart(
  chartType: D3ChartType,
  data: any[],
  theme: ThemeTokens,
  options: ChartOptions = {}
): D3RenderResult {
  switch (chartType) {
    case 'bar':
      return renderBarChart(data as BarChartData[], theme, options);
    case 'pie':
      return renderPieChart(data as PieChartData[], theme, options);
    case 'donut':
      return renderPieChart(data as PieChartData[], theme, { ...options, donut: true });
    case 'line':
      return renderLineChart(data as LineChartData[], theme, options);
    case 'area':
      return renderLineChart(data as LineChartData[], theme, { ...options, area: true });
    case 'gantt':
      return renderGanttChart(data as GanttChartData[], theme, options);
    case 'quadrant':
      return renderQuadrantChart(data as QuadrantData[], theme, options);
    case 'timeline':
      return renderTimelineChart(data as TimelineData[], theme, options);
    case 'sankey':
      return renderSankeyChart(data as any, theme, options);
    case 'radial':
      return renderRadialBarChart(data as BarChartData[], theme, options);
    case 'treemap':
      return renderTreemapChart(data as any, theme, options);
    default:
      return {
        svg: createErrorSvg(`Unknown chart type: ${chartType}`, theme),
        success: false,
        error: `Unknown chart type: ${chartType}`,
      };
  }
}

export default {
  renderD3Chart,
  renderBarChart,
  renderPieChart,
  renderLineChart,
  renderGanttChart,
  renderTimelineChart,
  renderQuadrantChart,
  renderSankeyChart,
  renderRadialBarChart,
  renderTreemapChart,
  isD3ChartType,
};
