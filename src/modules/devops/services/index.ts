import { DevOpsRepository } from '../repository';
import type { SystemLog, HealthCheck, Deployment, Backup, DevOpsDashboard } from '../types';
import type { SystemLogInput, HealthInput, DeploymentInput, BackupInput } from '../schemas';

const repository = new DevOpsRepository();

export class DevOpsModuleService {
  async getDashboard(): Promise<DevOpsDashboard> { return repository.getDashboard(); }
  async queryLogs(filters?: Parameters<typeof repository.queryLogs>[0]): Promise<SystemLog[]> { return repository.queryLogs(filters); }
  async listLogs(level?: string): Promise<SystemLog[]> { return repository.listLogs(level); }
  async createLog(input: SystemLogInput): Promise<SystemLog> { return repository.createLog(input); }
  async getHealthChecks(): Promise<HealthCheck[]> { return repository.getHealthChecks(); }
  async getHealthSummary() { return repository.getHealthSummary(); }
  async listServices(): Promise<string[]> { return repository.listServices(); }
  async listDeployments(environment?: string): Promise<Deployment[]> { return repository.listDeployments(environment); }
  async createDeployment(input: DeploymentInput): Promise<Deployment> { return repository.createDeployment(input); }
  async listBackups(type?: string): Promise<Backup[]> { return repository.listBackups(type); }
  async createBackup(input: BackupInput): Promise<Backup> { return repository.createBackup(input); }
  async getBackupStats() { return repository.getBackupStats(); }
}

export const devOpsModuleService = new DevOpsModuleService();
