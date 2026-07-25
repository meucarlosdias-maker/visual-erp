import type { ChartType, ChartConfig, TimeSeriesPoint } from '../types';

export function buildChartData(type: ChartType, data: TimeSeriesPoint[], config: Partial<ChartConfig>): Record<string, unknown> {
  const base = {
    type,
    title: config.title ?? '',
    data,
    labels: data.map((d) => d.label ?? d.date),
    values: data.map((d) => d.value),
    colors: config.colors ?? defaultColors(type, data.length),
    showLegend: config.showLegend ?? true,
    showGrid: config.showGrid ?? true,
    height: config.height ?? 300,
  };

  switch (type) {
    case 'line':
      return { ...base, fill: false, smooth: true, stacked: config.stacked ?? false };
    case 'bar':
      return { ...base, stacked: config.stacked ?? false, barWidth: 20 };
    case 'pie':
      return { ...base, innerRadius: 0, outerRadius: 80, showLabels: true };
    case 'area':
      return { ...base, fill: true, smooth: true, stacked: config.stacked ?? true };
    case 'radar':
      return { ...base, maxValue: Math.max(...data.map((d) => d.value), 100) };
    case 'funnel':
      return { ...base, sortBy: 'desc' as const };
    case 'gauge':
      return { ...base, min: 0, max: 100, threshold: 70 };
    case 'heatmap':
      return { ...base, xField: 'date', yField: 'label', colorField: 'value' };
  }
}

export function defaultColors(type: ChartType, count: number): string[] {
  const palette = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  ];
  if (type === 'gauge') return ['#10b981', '#f59e0b', '#ef4444'];
  return palette.slice(0, count);
}

export function aggregateChartData(data: TimeSeriesPoint[], type: ChartType, groupCount = 12): TimeSeriesPoint[] {
  if (data.length <= groupCount) return data;
  const step = Math.ceil(data.length / groupCount);
  const result: TimeSeriesPoint[] = [];
  for (let i = 0; i < data.length; i += step) {
    const slice = data.slice(i, i + step);
    result.push({
      date: slice[0].date,
      value: slice.reduce((s, p) => s + p.value, 0) / slice.length,
      label: slice[0].label ?? slice[0].date,
    });
  }
  return result;
}
