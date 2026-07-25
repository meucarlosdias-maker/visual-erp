import { logger } from './logger';

export interface BackupManifest {
  id: string;
  version: string;
  timestamp: string;
  type: 'full' | 'incremental' | 'config';
  files: string[];
  sizeBytes: number;
  checksum: string;
}

export function createBackupManifest(
  type: BackupManifest['type'],
  files: string[],
  sizeBytes: number,
): BackupManifest {
  return {
    id: crypto.randomUUID(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    type,
    files,
    sizeBytes,
    checksum: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
  };
}

export function validateManifest(manifest: BackupManifest): boolean {
  const required = ['id', 'version', 'timestamp', 'type', 'files', 'sizeBytes', 'checksum'];
  const missing = required.filter((key) => !(key in manifest));
  if (missing.length > 0) {
    logger.error('Invalid backup manifest', { missing });
    return false;
  }
  return true;
}

export const BACKUP_RETENTION = {
  daily: 7,
  weekly: 4,
  monthly: 3,
} as const;

export function getRetentionPolicy(): typeof BACKUP_RETENTION {
  return BACKUP_RETENTION;
}
