import type { LogLevel, HealthStatus, DeploymentStatus, BackupType, BackupStatus, EnvironmentType } from '@/core/devops';

export interface SystemLog {
  id: string; companyId: string | null; level: LogLevel; source: string;
  message: string; context: Record<string, unknown> | null; createdAt: Date;
}

export interface HealthCheck {
  id: string; service: string; status: HealthStatus;
  responseTime: number | null; checkedAt: Date;
}

export interface Deployment {
  id: string; version: string; environment: EnvironmentType;
  status: DeploymentStatus; startedAt: Date | null; finishedAt: Date | null;
  commit: string | null; branch: string | null; createdAt: Date;
}

export interface Backup {
  id: string; type: BackupType; status: BackupStatus;
  size: number | null; startedAt: Date | null; finishedAt: Date | null; createdAt: Date;
}

export interface DevOpsDashboard {
  healthSummary: { total: number; healthy: number; degraded: number; unhealthy: number; unknown: number; avgResponseTime: number };
  systemMetrics: { uptime: number; memoryUsage: number; cpuUsage: number; totalRequests: number; avgResponseTime: number; errorRate: number; activeConnections: number };
  recentLogs: SystemLog[]; recentDeployments: Deployment[]; recentBackups: Backup[];
}

export const LOG_LEVEL_LABELS: Record<LogLevel, string> = {
  TRACE: 'Trace', DEBUG: 'Debug', INFO: 'Info', WARN: 'Warn', ERROR: 'Erro', FATAL: 'Fatal',
};

export const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  TRACE: 'bg-gray-100 text-gray-700', DEBUG: 'bg-blue-100 text-blue-700',
  INFO: 'bg-green-100 text-green-700', WARN: 'bg-yellow-100 text-yellow-700',
  ERROR: 'bg-red-100 text-red-700', FATAL: 'bg-red-200 text-red-800',
};

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  healthy: 'Saudável', degraded: 'Degradado', unhealthy: 'Indisponível', unknown: 'Desconhecido',
};

export const DEPLOYMENT_STATUS_LABELS: Record<DeploymentStatus, string> = {
  pending: 'Pendente', running: 'Executando', completed: 'Concluído', failed: 'Falhou', rolled_back: 'Revertido',
};

export const BACKUP_STATUS_LABELS: Record<BackupStatus, string> = {
  pending: 'Pendente', running: 'Executando', completed: 'Concluído', failed: 'Falhou',
};
