import type { HealthCheckEntry, HealthStatus, HealthSummary } from '../types';

const checks: HealthCheckEntry[] = [
  { id: 'hlth-001', service: 'database', status: 'healthy', responseTime: 45, checkedAt: new Date() },
  { id: 'hlth-002', service: 'api', status: 'healthy', responseTime: 12, checkedAt: new Date() },
  { id: 'hlth-003', service: 'storage', status: 'healthy', responseTime: 8, checkedAt: new Date() },
  { id: 'hlth-004', service: 'auth', status: 'healthy', responseTime: 5, checkedAt: new Date() },
  { id: 'hlth-005', service: 'queue', status: 'degraded', responseTime: 120, checkedAt: new Date() },
  { id: 'hlth-006', service: 'workers', status: 'healthy', responseTime: 30, checkedAt: new Date() },
  { id: 'hlth-007', service: 'ai', status: 'healthy', responseTime: 200, checkedAt: new Date() },
  { id: 'hlth-008', service: 'plugins', status: 'unknown', responseTime: null, checkedAt: new Date() },
];

const SERVICE_LABELS: Record<string, string> = {
  database: 'Banco de Dados', api: 'API', storage: 'Storage',
  auth: 'Autenticação', queue: 'Filas', workers: 'Workers',
  ai: 'IA', plugins: 'Plugins',
};

export function runHealthCheck(service: string): HealthCheckEntry {
  const entry: HealthCheckEntry = {
    id: crypto.randomUUID(), service, status: 'healthy',
    responseTime: Math.floor(Math.random() * 200), checkedAt: new Date(),
  };
  checks.push(entry);
  return entry;
}

export function getLatestHealthChecks(): HealthCheckEntry[] {
  return [...checks].sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime())
    .filter((c, i, arr) => arr.findIndex((x) => x.service === c.service) === i);
}

export function getHealthHistory(service: string, limit = 20): HealthCheckEntry[] {
  return checks.filter((c) => c.service === service).sort((a, b) => b.checkedAt.getTime() - a.checkedAt.getTime()).slice(0, limit);
}

export function getHealthSummary(): HealthSummary {
  const latest = getLatestHealthChecks();
  return {
    total: latest.length,
    healthy: latest.filter((c) => c.status === 'healthy').length,
    degraded: latest.filter((c) => c.status === 'degraded').length,
    unhealthy: latest.filter((c) => c.status === 'unhealthy').length,
    unknown: latest.filter((c) => c.status === 'unknown').length,
    avgResponseTime: latest.reduce((sum, c) => sum + (c.responseTime ?? 0), 0) / latest.length,
  };
}

export function getServiceLabel(service: string): string {
  return SERVICE_LABELS[service] ?? service;
}

export function listServices(): string[] {
  return ['database', 'api', 'storage', 'auth', 'queue', 'workers', 'ai', 'plugins'];
}
