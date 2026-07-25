export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export type DeploymentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';

export type BackupType = 'manual' | 'scheduled';

export type BackupStatus = 'pending' | 'running' | 'completed' | 'failed';

export type EnvironmentType = 'development' | 'staging' | 'production' | 'sandbox';

export interface LogEntry {
  id: string;
  companyId: string | null;
  level: LogLevel;
  source: string;
  message: string;
  context: Record<string, unknown> | null;
  createdAt: Date;
}

export interface HealthCheckEntry {
  id: string;
  service: string;
  status: HealthStatus;
  responseTime: number | null;
  checkedAt: Date;
}

export interface DeploymentEntry {
  id: string;
  version: string;
  environment: EnvironmentType;
  status: DeploymentStatus;
  startedAt: Date | null;
  finishedAt: Date | null;
  commit: string | null;
  branch: string | null;
  createdAt: Date;
}

export interface BackupEntry {
  id: string;
  type: BackupType;
  status: BackupStatus;
  size: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
}

export interface HealthSummary {
  total: number;
  healthy: number;
  degraded: number;
  unhealthy: number;
  unknown: number;
  avgResponseTime: number;
}

export interface SystemMetrics {
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  activeConnections: number;
}

export interface DevOpsDashboardData {
  healthSummary: HealthSummary;
  systemMetrics: SystemMetrics;
  recentLogs: LogEntry[];
  recentDeployments: DeploymentEntry[];
  recentBackups: BackupEntry[];
}
