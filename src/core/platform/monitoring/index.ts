import type { PlatformMetricEntry, MetricName } from '../types';

const metrics: PlatformMetricEntry[] = [
  { id: 'met-001', metric: 'active_companies', value: 42, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-002', metric: 'total_users', value: 385, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-003', metric: 'active_projects', value: 127, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-004', metric: 'mrr', value: 52500, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-005', metric: 'storage_used', value: 2560, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-006', metric: 'ai_usage', value: 8500, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-007', metric: 'api_calls', value: 125000, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-008', metric: 'jobs_executed', value: 3420, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-009', metric: 'avg_response_time', value: 245, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
  { id: 'met-010', metric: 'critical_errors', value: 3, referenceDate: new Date('2026-07-20'), createdAt: new Date() },
];

export function recordMetric(input: Omit<PlatformMetricEntry, 'id' | 'createdAt'>): PlatformMetricEntry {
  const entry: PlatformMetricEntry = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
  metrics.push(entry);
  return entry;
}

export function getMetric(name: MetricName): PlatformMetricEntry | undefined {
  return [...metrics].filter((m) => m.metric === name).sort((a, b) => b.referenceDate.getTime() - a.referenceDate.getTime())[0];
}

export function getMetricsHistory(name: MetricName, days = 30): PlatformMetricEntry[] {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return metrics.filter((m) => m.metric === name && m.referenceDate >= cutoff);
}

export function getAllLatestMetrics(): Record<string, number> {
  const result: Record<string, number> = {};
  const names: MetricName[] = ['active_companies', 'blocked_companies', 'total_users', 'active_projects', 'mrr', 'storage_used', 'ai_usage', 'api_calls', 'jobs_executed', 'avg_response_time', 'critical_errors'];
  for (const name of names) {
    const metric = getMetric(name);
    result[name] = metric?.value ?? 0;
  }
  return result;
}
