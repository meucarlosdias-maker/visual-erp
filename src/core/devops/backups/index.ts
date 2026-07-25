import type { BackupEntry, BackupType, BackupStatus } from '../types';

const backups: BackupEntry[] = [
  { id: 'bkp-001', type: 'scheduled', status: 'completed', size: 2560, startedAt: new Date('2026-07-20T03:00:00'), finishedAt: new Date('2026-07-20T03:15:00'), createdAt: new Date('2026-07-20T02:55:00') },
  { id: 'bkp-002', type: 'manual', status: 'completed', size: 2450, startedAt: new Date('2026-07-19T10:00:00'), finishedAt: new Date('2026-07-19T10:12:00'), createdAt: new Date('2026-07-19T09:55:00') },
  { id: 'bkp-003', type: 'scheduled', status: 'completed', size: 2500, startedAt: new Date('2026-07-19T03:00:00'), finishedAt: new Date('2026-07-19T03:14:00'), createdAt: new Date('2026-07-19T02:55:00') },
  { id: 'bkp-004', type: 'manual', status: 'running', size: null, startedAt: new Date('2026-07-20T12:00:00'), finishedAt: null, createdAt: new Date('2026-07-20T11:55:00') },
];

export function createBackup(input: Omit<BackupEntry, 'id' | 'createdAt'>): BackupEntry {
  const entry: BackupEntry = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
  backups.push(entry);
  return entry;
}

export function updateBackup(id: string, updates: Partial<Omit<BackupEntry, 'id' | 'createdAt'>>): BackupEntry | undefined {
  const idx = backups.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  backups[idx] = { ...backups[idx], ...updates };
  return backups[idx];
}

export function getBackup(id: string): BackupEntry | undefined { return backups.find((b) => b.id === id); }

export function listBackups(type?: BackupType): BackupEntry[] {
  let result = [...backups];
  if (type) result = result.filter((b) => b.type === type);
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getLatestBackup(): BackupEntry | undefined {
  return [...backups].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
}

export function getBackupStats(): { total: number; totalSize: number; lastBackup: Date | null } {
  const completed = backups.filter((b) => b.status === 'completed');
  return {
    total: completed.length,
    totalSize: completed.reduce((sum, b) => sum + (b.size ?? 0), 0),
    lastBackup: completed.sort((a, b) => b.finishedAt!.getTime() - a.finishedAt!.getTime())[0]?.finishedAt ?? null,
  };
}
