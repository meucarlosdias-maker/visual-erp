import { describe, it, expect } from 'vitest';
import { createBackupManifest, validateManifest, BACKUP_RETENTION, getRetentionPolicy } from '@/lib/backup';

describe('createBackupManifest', () => {
  it('creates a valid full backup manifest', () => {
    const manifest = createBackupManifest('full', ['dump.sql', 'uploads.tar'], 1048576);
    expect(manifest.id).toBeDefined();
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.type).toBe('full');
    expect(manifest.files).toHaveLength(2);
    expect(manifest.sizeBytes).toBe(1048576);
    expect(manifest.checksum).toBeDefined();
  });

  it('creates incremental backup manifest', () => {
    const manifest = createBackupManifest('incremental', ['wal-0001.log'], 51200);
    expect(manifest.type).toBe('incremental');
  });

  it('creates config backup manifest', () => {
    const manifest = createBackupManifest('config', ['env.txt'], 1024);
    expect(manifest.type).toBe('config');
  });
});

describe('validateManifest', () => {
  it('validates a correct manifest', () => {
    const manifest = createBackupManifest('full', ['test.sql'], 100);
    expect(validateManifest(manifest)).toBe(true);
  });

  it('rejects manifest with missing fields', () => {
    const invalid = { id: '123' };
    expect(validateManifest(invalid as never)).toBe(false);
  });
});

describe('BACKUP_RETENTION', () => {
  it('has retention policy', () => {
    expect(BACKUP_RETENTION.daily).toBe(7);
    expect(BACKUP_RETENTION.weekly).toBe(4);
    expect(BACKUP_RETENTION.monthly).toBe(3);
  });
});

describe('getRetentionPolicy', () => {
  it('returns the retention policy', () => {
    const policy = getRetentionPolicy();
    expect(policy).toEqual(BACKUP_RETENTION);
  });
});
