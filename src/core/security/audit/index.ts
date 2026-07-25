import type { AuditEntry, AuditAction } from '../types';

const auditLog: AuditEntry[] = [];

export function recordAudit(input: Omit<AuditEntry, 'id' | 'createdAt'>): AuditEntry {
  const entry: AuditEntry = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
  auditLog.push(entry);
  return entry;
}

export function queryAudit(filters?: {
  companyId?: string; userId?: string; entity?: string; action?: AuditAction;
  startDate?: Date; endDate?: Date;
}): AuditEntry[] {
  let results = [...auditLog];
  if (filters?.companyId) results = results.filter((e) => e.companyId === filters.companyId);
  if (filters?.userId) results = results.filter((e) => e.userId === filters.userId);
  if (filters?.entity) results = results.filter((e) => e.entity === filters.entity);
  if (filters?.action) results = results.filter((e) => e.action === filters.action);
  if (filters?.startDate) results = results.filter((e) => e.createdAt >= filters.startDate!);
  if (filters?.endDate) results = results.filter((e) => e.createdAt <= filters.endDate!);
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAuditById(id: string): AuditEntry | undefined {
  return auditLog.find((e) => e.id === id);
}

export function listAuditEvents(limit = 100): AuditEntry[] {
  return [...auditLog].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
}
