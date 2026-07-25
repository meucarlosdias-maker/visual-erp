import { logger } from './logger';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  uptime: string;
  timestamp: string;
  checks: {
    database: 'connected' | 'disconnected';
    memory: 'healthy' | 'warning' | 'critical';
  };
}

const startTime = Date.now();

export function getHealthStatus(dbConnected = true): HealthStatus {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const ratio = heapUsedMB / (heapTotalMB || 1);

  const memory: 'healthy' | 'warning' | 'critical' =
    ratio > 0.9 ? 'critical' : ratio > 0.7 ? 'warning' : 'healthy';

  return {
    status: dbConnected && memory !== 'critical' ? 'ok' : 'degraded',
    version: '1.0.0',
    uptime: `${Math.floor((Date.now() - startTime) / 1000)}s`,
    timestamp: new Date().toISOString(),
    checks: {
      database: dbConnected ? 'connected' : 'disconnected',
      memory,
    },
  };
}

export function logResourceUsage(): void {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  logger.info('Resource usage', {
    heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
    rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
    cpuUser: `${Math.round(cpu.user / 1000)}ms`,
    cpuSystem: `${Math.round(cpu.system / 1000)}ms`,
  });
}

export function measureResponseTime(handler: () => Promise<Response>): Promise<Response> {
  const start = performance.now();
  return handler().then((response) => {
    const duration = performance.now() - start;
    logger.info('Response time', { durationMs: Math.round(duration) });
    return response;
  });
}
