import { info, warn, error, debug, fatal, trace, queryLogs, listLogs, getLogById } from '../logging';
import { getSystemMetrics, recordRequest, resetMetrics, connectionOpened, connectionClosed } from '../monitoring';
import { startSpan, endSpan, getTrace, listTraces } from '../tracing';
import { runHealthCheck, getLatestHealthChecks, getHealthHistory, getHealthSummary, getServiceLabel, listServices } from '../health';
import { createDeployment, updateDeployment, getDeployment, listDeployments, getLatestDeployment } from '../deployment';
import { createBackup, updateBackup, getBackup, listBackups, getLatestBackup, getBackupStats } from '../backups';
import type { LogEntry, LogLevel, HealthCheckEntry, HealthSummary, DeploymentEntry, EnvironmentType, DeploymentStatus, BackupEntry, BackupType, BackupStatus, SystemMetrics, DevOpsDashboardData } from '../types';

export class DevOpsService {
  log(level: LogLevel, source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
    const fns = { TRACE: trace, DEBUG: debug, INFO: info, WARN: warn, ERROR: error, FATAL: fatal };
    return fns[level](source, message, context, companyId);
  }
  queryLogs(filters?: Parameters<typeof queryLogs>[0]): LogEntry[] { return queryLogs(filters); }
  listLogs(limit?: number): LogEntry[] { return listLogs(limit); }
  getLog(id: string): LogEntry | undefined { return getLogById(id); }

  getSystemMetrics(): SystemMetrics { return getSystemMetrics(); }
  recordRequest(responseTime: number, isError: boolean): void { recordRequest(responseTime, isError); }
  resetMetrics(): void { resetMetrics(); }

  startSpan(operation: string, parentId?: string, metadata?: Record<string, unknown>): string { return startSpan(operation, parentId, metadata); }
  endSpan(spanId: string) { return endSpan(spanId); }
  getTrace(spanId: string) { return getTrace(spanId); }
  listTraces(limit?: number) { return listTraces(limit); }

  runHealthCheck(service: string): HealthCheckEntry { return runHealthCheck(service); }
  getHealthChecks(): HealthCheckEntry[] { return getLatestHealthChecks(); }
  getHealthHistory(service: string, limit?: number): HealthCheckEntry[] { return getHealthHistory(service, limit); }
  getHealthSummary(): HealthSummary { return getHealthSummary(); }
  getServiceLabel(service: string): string { return getServiceLabel(service); }
  listServices(): string[] { return listServices(); }

  createDeployment(input: Parameters<typeof createDeployment>[0]): DeploymentEntry { return createDeployment(input); }
  updateDeployment(id: string, updates: Parameters<typeof updateDeployment>[1]): DeploymentEntry | undefined { return updateDeployment(id, updates); }
  getDeployment(id: string): DeploymentEntry | undefined { return getDeployment(id); }
  listDeployments(environment?: EnvironmentType): DeploymentEntry[] { return listDeployments(environment); }
  getLatestDeployment(environment?: EnvironmentType): DeploymentEntry | undefined { return getLatestDeployment(environment); }

  createBackup(input: Parameters<typeof createBackup>[0]): BackupEntry { return createBackup(input); }
  updateBackup(id: string, updates: Parameters<typeof updateBackup>[1]): BackupEntry | undefined { return updateBackup(id, updates); }
  getBackup(id: string): BackupEntry | undefined { return getBackup(id); }
  listBackups(type?: BackupType): BackupEntry[] { return listBackups(type); }
  getLatestBackup(): BackupEntry | undefined { return getLatestBackup(); }
  getBackupStats() { return getBackupStats(); }

  getDashboardData(): DevOpsDashboardData {
    return {
      healthSummary: getHealthSummary(),
      systemMetrics: getSystemMetrics(),
      recentLogs: listLogs(5),
      recentDeployments: listDeployments().slice(0, 5),
      recentBackups: listBackups().slice(0, 5),
    };
  }
}

export const devOpsService = new DevOpsService();
