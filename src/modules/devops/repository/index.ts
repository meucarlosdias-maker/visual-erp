import { devOpsService } from '@/core/devops';
import type { SystemLog, HealthCheck, Deployment, Backup, DevOpsDashboard } from '../types';
import type { SystemLogInput, HealthInput, DeploymentInput, BackupInput } from '../schemas';

export class DevOpsRepository {
  async getDashboard(): Promise<DevOpsDashboard> {
    const data = devOpsService.getDashboardData();
    return {
      healthSummary: data.healthSummary,
      systemMetrics: data.systemMetrics,
      recentLogs: data.recentLogs.map((l) => ({ ...l })) as SystemLog[],
      recentDeployments: data.recentDeployments.map((d) => ({ ...d })) as Deployment[],
      recentBackups: data.recentBackups.map((b) => ({ ...b })) as Backup[],
    };
  }

  async queryLogs(filters?: Parameters<typeof devOpsService.queryLogs>[0]): Promise<SystemLog[]> {
    return devOpsService.queryLogs(filters).map((l) => ({ ...l })) as SystemLog[];
  }
  async listLogs(level?: string): Promise<SystemLog[]> {
    const logs = devOpsService.listLogs();
    return (level ? logs.filter((l) => l.level === level) : logs).map((l) => ({ ...l })) as SystemLog[];
  }
  async createLog(input: SystemLogInput): Promise<SystemLog> {
    const entry = devOpsService.log(input.level as Parameters<typeof devOpsService.log>[0], input.source, input.message, input.context ?? null, input.companyId ?? null);
    return { ...entry } as SystemLog;
  }

  async getHealthChecks(): Promise<HealthCheck[]> { return devOpsService.getHealthChecks().map((h) => ({ ...h })) as HealthCheck[]; }
  async getHealthSummary() { return devOpsService.getHealthSummary(); }
  async listServices(): Promise<string[]> { return devOpsService.listServices(); }

  async listDeployments(environment?: string): Promise<Deployment[]> {
    return devOpsService.listDeployments(environment as Parameters<typeof devOpsService.listDeployments>[0]).map((d) => ({ ...d })) as Deployment[];
  }
  async createDeployment(input: DeploymentInput): Promise<Deployment> {
    const entry = devOpsService.createDeployment({ ...input, startedAt: null, finishedAt: null, commit: input.commit ?? null, branch: input.branch ?? null });
    return { ...entry } as Deployment;
  }

  async listBackups(type?: string): Promise<Backup[]> {
    return devOpsService.listBackups(type as Parameters<typeof devOpsService.listBackups>[0]).map((b) => ({ ...b })) as Backup[];
  }
  async createBackup(input: BackupInput): Promise<Backup> {
    const entry = devOpsService.createBackup({ ...input, startedAt: null, finishedAt: null, size: input.size ?? null });
    return { ...entry } as Backup;
  }
  async getBackupStats() { return devOpsService.getBackupStats(); }
}
