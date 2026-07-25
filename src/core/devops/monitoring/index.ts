import type { SystemMetrics, LogEntry, DeploymentEntry, BackupEntry } from '../types';
import { listLogs } from '../logging';

let startTime = Date.now();
let requestCount = 0;
let totalResponseTime = 0;
let errorCount = 0;
let activeConnections = 0;

export function recordRequest(responseTime: number, isError: boolean): void {
  requestCount++;
  totalResponseTime += responseTime;
  if (isError) errorCount++;
}

export function connectionOpened(): void { activeConnections++; }
export function connectionClosed(): void { activeConnections = Math.max(0, activeConnections - 1); }

export function getSystemMetrics(): SystemMetrics {
  const uptime = Date.now() - startTime;
  const avgResponseTime = requestCount > 0 ? totalResponseTime / requestCount : 0;
  const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;
  return {
    uptime, memoryUsage: process.memoryUsage ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024) : 0,
    cpuUsage: 0, totalRequests: requestCount, avgResponseTime: Math.round(avgResponseTime),
    errorRate: Math.round(errorRate * 100) / 100, activeConnections,
  };
}

export function resetMetrics(): void {
  startTime = Date.now();
  requestCount = 0;
  totalResponseTime = 0;
  errorCount = 0;
  activeConnections = 0;
}
