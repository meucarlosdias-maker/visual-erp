import type { DeploymentEntry, DeploymentStatus, EnvironmentType } from '../types';

const deployments: DeploymentEntry[] = [
  { id: 'dep-001', version: '2.5.0', environment: 'production', status: 'completed', startedAt: new Date('2026-07-20T02:00:00'), finishedAt: new Date('2026-07-20T02:05:30'), commit: 'a1b2c3d4', branch: 'main', createdAt: new Date('2026-07-20T01:55:00') },
  { id: 'dep-002', version: '2.4.2', environment: 'production', status: 'completed', startedAt: new Date('2026-07-15T02:00:00'), finishedAt: new Date('2026-07-15T02:04:00'), commit: 'e5f6g7h8', branch: 'main', createdAt: new Date('2026-07-15T01:55:00') },
  { id: 'dep-003', version: '2.5.0-rc.1', environment: 'staging', status: 'completed', startedAt: new Date('2026-07-19T10:00:00'), finishedAt: new Date('2026-07-19T10:03:00'), commit: 'i9j0k1l2', branch: 'release/2.5.0', createdAt: new Date('2026-07-19T09:55:00') },
  { id: 'dep-004', version: '2.5.0', environment: 'production', status: 'running', startedAt: new Date('2026-07-20T03:00:00'), finishedAt: null, commit: 'm3n4o5p6', branch: 'main', createdAt: new Date('2026-07-20T02:55:00') },
];

export function createDeployment(input: Omit<DeploymentEntry, 'id' | 'createdAt'>): DeploymentEntry {
  const entry: DeploymentEntry = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
  deployments.push(entry);
  return entry;
}

export function updateDeployment(id: string, updates: Partial<Omit<DeploymentEntry, 'id' | 'createdAt'>>): DeploymentEntry | undefined {
  const idx = deployments.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  deployments[idx] = { ...deployments[idx], ...updates };
  return deployments[idx];
}

export function getDeployment(id: string): DeploymentEntry | undefined { return deployments.find((d) => d.id === id); }

export function listDeployments(environment?: EnvironmentType): DeploymentEntry[] {
  let result = [...deployments];
  if (environment) result = result.filter((d) => d.environment === environment);
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getLatestDeployment(environment?: EnvironmentType): DeploymentEntry | undefined {
  const env = environment ?? 'production';
  return deployments.filter((d) => d.environment === env).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
}
