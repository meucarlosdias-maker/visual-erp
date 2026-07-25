import type { LogEntry, LogLevel } from '../types';

const logs: LogEntry[] = [];

export function log(input: Omit<LogEntry, 'id' | 'createdAt'>): LogEntry {
  const entry: LogEntry = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
  logs.push(entry);
  if (logs.length > 10000) logs.shift();
  return entry;
}

export function info(source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
  return log({ companyId: companyId ?? null, level: 'INFO', source, message, context: context ?? null });
}

export function warn(source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
  return log({ companyId: companyId ?? null, level: 'WARN', source, message, context: context ?? null });
}

export function error(source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
  return log({ companyId: companyId ?? null, level: 'ERROR', source, message, context: context ?? null });
}

export function debug(source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
  return log({ companyId: companyId ?? null, level: 'DEBUG', source, message, context: context ?? null });
}

export function fatal(source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
  return log({ companyId: companyId ?? null, level: 'FATAL', source, message, context: context ?? null });
}

export function trace(source: string, message: string, context?: Record<string, unknown> | null, companyId?: string | null): LogEntry {
  return log({ companyId: companyId ?? null, level: 'TRACE', source, message, context: context ?? null });
}

export function queryLogs(filters?: { level?: LogLevel; source?: string; companyId?: string; startDate?: Date; endDate?: Date }): LogEntry[] {
  let result = [...logs];
  if (filters?.level) result = result.filter((l) => l.level === filters.level);
  if (filters?.source) result = result.filter((l) => l.source === filters.source);
  if (filters?.companyId) result = result.filter((l) => l.companyId === filters.companyId);
  if (filters?.startDate) result = result.filter((l) => l.createdAt >= filters.startDate!);
  if (filters?.endDate) result = result.filter((l) => l.createdAt <= filters.endDate!);
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function listLogs(limit = 100): LogEntry[] {
  return [...logs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
}

export function getLogById(id: string): LogEntry | undefined {
  return logs.find((l) => l.id === id);
}
