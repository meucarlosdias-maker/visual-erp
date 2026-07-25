'use client';

import { devOpsModuleService } from '../services';
import type { SystemLogInput, DeploymentInput, BackupInput } from '../schemas';

export async function getDashboard() { return devOpsModuleService.getDashboard(); }
export async function queryLogs(filters?: Parameters<typeof devOpsModuleService.queryLogs>[0]) { return devOpsModuleService.queryLogs(filters); }
export async function listLogs(level?: string) { return devOpsModuleService.listLogs(level); }
export async function createLog(input: SystemLogInput) { return devOpsModuleService.createLog(input); }
export async function getHealthChecks() { return devOpsModuleService.getHealthChecks(); }
export async function getHealthSummary() { return devOpsModuleService.getHealthSummary(); }
export async function listServices() { return devOpsModuleService.listServices(); }
export async function listDeployments(environment?: string) { return devOpsModuleService.listDeployments(environment); }
export async function createDeployment(input: DeploymentInput) { return devOpsModuleService.createDeployment(input); }
export async function listBackups(type?: string) { return devOpsModuleService.listBackups(type); }
export async function createBackup(input: BackupInput) { return devOpsModuleService.createBackup(input); }
export async function getBackupStats() { return devOpsModuleService.getBackupStats(); }
