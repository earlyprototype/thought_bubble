/**
 * Data Transformation and Validation Layer
 * 
 * Transforms flexible input data structures to strict chart-specific formats.
 * Provides runtime validation with helpful error messages.
 */

import type { 
  BarChartData, 
  PieChartData, 
  LineChartData, 
  TimelineData,
  GanttChartData,
  QuadrantData,
  SankeyInputData,
  TreemapInputData,
  D3ChartType 
} from './d3_renderer.js';

/**
 * Union type for all chart data types
 */
export type ChartDataUnion = 
  | BarChartData[] 
  | PieChartData[] 
  | LineChartData[] 
  | TimelineData[]
  | GanttChartData[]
  | QuadrantData[];

/**
 * Extract a field from an object, trying multiple possible field names
 */
function extractField(obj: any, fieldNames: string[]): any {
  for (const name of fieldNames) {
    if (obj[name] !== undefined && obj[name] !== null) {
      return obj[name];
    }
  }
  return undefined;
}

/**
 * Extract a numeric value from an object, trying multiple possible field names
 */
function extractNumeric(obj: any, fieldNames: string[]): number | undefined {
  const value = extractField(obj, fieldNames);
  if (value === undefined || value === null) return undefined;
  
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Transform any data structure to match the specific chart type requirements
 */
export function transformChartData(
  rawData: any[],
  chartType: D3ChartType
): ChartDataUnion {
  if (!Array.isArray(rawData)) {
    throw new Error(`Chart data must be an array, got ${typeof rawData}`);
  }

  if (rawData.length === 0) {
    throw new Error('Chart data array cannot be empty');
  }

  switch (chartType) {
    case 'bar':
    case 'pie':
    case 'donut':
      return transformToLabelValue(rawData);
    
    case 'line':
    case 'area':
      return transformToXY(rawData);
    
    case 'timeline':
      return transformToTimeline(rawData);
    
    case 'gantt':
      return transformToGantt(rawData);
    
    case 'quadrant':
      return transformToQuadrant(rawData);
    
    case 'radial':
      return transformToLabelValue(rawData);
    
    case 'sankey':
    case 'treemap':
      return rawData as any;
    
    default:
      throw new Error(`Unknown chart type: ${chartType}`);
  }
}

/**
 * Transform to {label, value} format for bar/pie/donut charts
 */
function transformToLabelValue(rawData: any[]): BarChartData[] | PieChartData[] {
  return rawData.map((item, idx) => {
    // Try to extract label from various field names
    const label = extractField(item, [
      'label', 'name', 'category', 'key', 'id', 'title'
    ]);

    // Try to extract value from various field names
    // For KPI data with target/achieved, prefer achieved
    const value = extractNumeric(item, [
      'value', 'achieved', 'count', 'amount', 'total', 'sum', 'target', 'y'
    ]);

    return {
      label: label !== undefined ? String(label) : `Item ${idx + 1}`,
      value: value !== undefined ? value : 0
    };
  });
}

/**
 * Transform to {x, y, series?} format for line/area charts
 */
function transformToXY(rawData: any[]): LineChartData[] {
  return rawData.map((item, idx) => {
    // Try to extract x coordinate (can be number, date, or string)
    const x = extractField(item, [
      'x', 'date', 'time', 'period', 'month', 'year', 'quarter', 'timestamp', 'label', 'category'
    ]);

    // Try to extract y coordinate (numeric)
    const y = extractNumeric(item, [
      'y', 'value', 'amount', 'count', 'total', 'sum', 'members', 'achieved'
    ]);

    // Optional series name for multi-series charts
    const series = extractField(item, ['series', 'group', 'category', 'type']);

    if (x === undefined) {
      console.warn(`Missing x coordinate at index ${idx}, using index`);
    }
    if (y === undefined) {
      console.warn(`Missing y value at index ${idx}, using 0`);
    }

    return {
      x: x !== undefined ? x : idx,
      y: y !== undefined ? y : 0,
      series: series !== undefined ? String(series) : undefined
    };
  });
}

/**
 * Transform to {event, date, description?} format for timeline charts
 */
function transformToTimeline(rawData: any[]): TimelineData[] {
  return rawData.map((item, idx) => {
    // Try to extract event name
    const event = extractField(item, [
      'event', 'title', 'name', 'label', 'milestone', 'description'
    ]);

    // Try to extract date
    const date = extractField(item, [
      'date', 'time', 'timestamp', 'when', 'start'
    ]);

    // Optional description
    const description = extractField(item, [
      'description', 'desc', 'details', 'notes', 'summary'
    ]);

    if (!event) {
      console.warn(`Missing event name at index ${idx}`);
    }
    if (!date) {
      console.warn(`Missing date at index ${idx}`);
    }

    return {
      event: event !== undefined ? String(event) : `Event ${idx + 1}`,
      date: date !== undefined ? date : new Date(),
      description: description !== undefined ? String(description) : undefined
    };
  });
}

/**
 * Transform to {task, start, end, category?, progress?} format for Gantt charts
 */
function transformToGantt(rawData: any[]): GanttChartData[] {
  return rawData.map((item, idx) => {
    const task = extractField(item, [
      'task', 'name', 'title', 'label', 'activity'
    ]);

    const start = extractField(item, [
      'start', 'startDate', 'begin', 'from'
    ]);

    const end = extractField(item, [
      'end', 'endDate', 'finish', 'to', 'until'
    ]);

    const category = extractField(item, [
      'category', 'type', 'group', 'phase'
    ]);

    const progress = extractNumeric(item, [
      'progress', 'completion', 'percent', 'done'
    ]);

    return {
      task: task !== undefined ? String(task) : `Task ${idx + 1}`,
      start: start !== undefined ? start : new Date(),
      end: end !== undefined ? end : new Date(),
      category: category !== undefined ? String(category) : undefined,
      progress: progress !== undefined ? progress : undefined
    };
  });
}

/**
 * Transform to {label, x, y} format for quadrant charts
 */
function transformToQuadrant(rawData: any[]): QuadrantData[] {
  return rawData.map((item, idx) => {
    const label = extractField(item, [
      'label', 'name', 'title', 'id'
    ]);

    const x = extractNumeric(item, [
      'x', 'horizontal', 'urgency', 'importance', 'value1'
    ]);

    const y = extractNumeric(item, [
      'y', 'vertical', 'impact', 'effort', 'value2'
    ]);

    return {
      label: label !== undefined ? String(label) : `Item ${idx + 1}`,
      x: x !== undefined ? x : 0,
      y: y !== undefined ? y : 0
    };
  });
}

/**
 * Validate bar chart data and return normalized format
 */
export function validateBarChartData(data: any[]): BarChartData[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Bar chart requires non-empty array of data');
  }

  return data.map((item, idx) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Bar chart data item at index ${idx} must be an object`);
    }

    const label = item.label;
    const value = item.value;

    if (!label || typeof label !== 'string') {
      console.warn(`Missing or invalid 'label' at index ${idx}, using fallback`);
    }

    if (typeof value !== 'number' || isNaN(value)) {
      console.warn(`Invalid 'value' at index ${idx}: ${value}, using 0`);
    }

    return {
      label: String(label || `Item ${idx + 1}`),
      value: typeof value === 'number' && !isNaN(value) ? value : 0
    };
  });
}

/**
 * Validate pie chart data and return normalized format
 */
export function validatePieChartData(data: any[]): PieChartData[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Pie chart requires non-empty array of data');
  }

  return data.map((item, idx) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Pie chart data item at index ${idx} must be an object`);
    }

    const label = item.label;
    const value = item.value;

    if (!label || typeof label !== 'string') {
      console.warn(`Missing or invalid 'label' at index ${idx}, using fallback`);
    }

    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      console.warn(`Invalid 'value' at index ${idx}: ${value}, using 1`);
    }

    return {
      label: String(label || `Item ${idx + 1}`),
      value: typeof value === 'number' && !isNaN(value) && value > 0 ? value : 1
    };
  });
}

/**
 * Validate line chart data and return normalized format
 */
export function validateLineChartData(data: any[]): LineChartData[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Line chart requires non-empty array of data');
  }

  return data.map((item, idx) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Line chart data item at index ${idx} must be an object`);
    }

    const x = item.x;
    const y = item.y;

    if (x === undefined || x === null) {
      console.warn(`Missing 'x' at index ${idx}, using index`);
    }

    if (typeof y !== 'number' || isNaN(y)) {
      console.warn(`Invalid 'y' at index ${idx}: ${y}, using 0`);
    }

    return {
      x: x !== undefined && x !== null ? x : idx,
      y: typeof y === 'number' && !isNaN(y) ? y : 0,
      series: item.series !== undefined ? String(item.series) : undefined
    };
  });
}

/**
 * Validate timeline data and return normalized format
 */
export function validateTimelineData(data: any[]): TimelineData[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Timeline requires non-empty array of data');
  }

  return data.map((item, idx) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Timeline data item at index ${idx} must be an object`);
    }

    const event = item.event;
    const date = item.date;

    if (!event || typeof event !== 'string') {
      console.warn(`Missing or invalid 'event' at index ${idx}, using fallback`);
    }

    // Validate date
    let parsedDate: Date;
    if (date instanceof Date) {
      parsedDate = date;
    } else if (typeof date === 'string') {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Invalid date string at index ${idx}: ${date}, using current date`);
        parsedDate = new Date();
      }
    } else {
      console.warn(`Missing or invalid 'date' at index ${idx}, using current date`);
      parsedDate = new Date();
    }

    return {
      event: String(event || `Event ${idx + 1}`),
      date: parsedDate,
      description: item.description !== undefined ? String(item.description) : undefined
    };
  });
}

/**
 * Get validation function for a specific chart type
 */
export function getValidatorForChartType(chartType: D3ChartType) {
  switch (chartType) {
    case 'bar':
      return validateBarChartData;
    case 'pie':
    case 'donut':
      return validatePieChartData;
    case 'line':
    case 'area':
      return validateLineChartData;
    case 'timeline':
      return validateTimelineData;
    default:
      return (data: any[]) => data; // No validation for other types yet
  }
}
