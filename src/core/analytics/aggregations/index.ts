import type { TimeGranularity, AggregationResult, TimeSeriesPoint, AnalyticsFilter } from '../types';

export function aggregateByGranularity(data: { date: Date; value: number }[], granularity: TimeGranularity): AggregationResult[] {
  const grouped = new Map<string, { sum: number; count: number; metrics: Record<string, number> }>();

  for (const item of data) {
    const period = formatPeriod(item.date, granularity);
    const existing = grouped.get(period) ?? { sum: 0, count: 0, metrics: {} };
    existing.sum += item.value;
    existing.count += 1;
    grouped.set(period, existing);
  }

  return Array.from(grouped.entries()).map(([period, values]) => ({
    period,
    value: values.sum,
    count: values.count,
    metrics: values.metrics,
  }));
}

export function buildTimeSeries(
  data: { date: Date; value: number }[],
  granularity: TimeGranularity,
  label?: string,
): TimeSeriesPoint[] {
  const grouped = aggregateByGranularity(data, granularity);
  const values = grouped.map((g) => g.value);

  return grouped.map((g) => ({
    date: g.period,
    value: g.value,
    label,
  }));
}

export function formatPeriod(date: Date, granularity: TimeGranularity): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const week = getWeekNumber(date);

  switch (granularity) {
    case 'hour': return `${year}-${month}-${day}T${String(date.getHours()).padStart(2, '0')}:00`;
    case 'day': return `${year}-${month}-${day}`;
    case 'week': return `${year}-W${String(week).padStart(2, '0')}`;
    case 'month': return `${year}-${month}`;
    case 'quarter': return `${year}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
    case 'year': return `${year}`;
  }
}

export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - startOfYear.getTime();
  return Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7);
}

export function applyDateFilter<T extends { date: Date }>(data: T[], filter: AnalyticsFilter): T[] {
  let filtered = data;
  if (filter.dateStart) {
    const start = new Date(filter.dateStart);
    filtered = filtered.filter((d) => d.date >= start);
  }
  if (filter.dateEnd) {
    const end = new Date(filter.dateEnd);
    filtered = filtered.filter((d) => d.date <= end);
  }
  return filtered;
}

export function computeSummary(values: number[]): { total: number; average: number; min: number; max: number; median: number } {
  if (values.length === 0) return { total: 0, average: 0, min: 0, max: 0, median: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const total = values.reduce((s, v) => s + v, 0);
  return {
    total,
    average: total / values.length,
    min: sorted[0],
    max: sorted[values.length - 1],
    median: sorted[Math.floor(values.length / 2)],
  };
}
