import type { ShortMemoryEntry, LongMemoryEntry } from '../types';

const shortMemory: Map<string, ShortMemoryEntry[]> = new Map();

export function addToShortMemory(sessionId: string, entry: ShortMemoryEntry): void {
  const existing = shortMemory.get(sessionId) ?? [];
  existing.push(entry);
  if (existing.length > 50) {
    existing.splice(0, existing.length - 50);
  }
  shortMemory.set(sessionId, existing);
}

export function getShortMemory(sessionId: string): ShortMemoryEntry[] {
  return shortMemory.get(sessionId) ?? [];
}

export function clearShortMemory(sessionId: string): void {
  shortMemory.delete(sessionId);
}

const longMemory: Map<string, LongMemoryEntry[]> = new Map();

export function addToLongMemory(scope: string, entry: Omit<LongMemoryEntry, 'id' | 'createdAt'>): LongMemoryEntry {
  const existing = longMemory.get(scope) ?? [];
  const newEntry: LongMemoryEntry = {
    id: crypto.randomUUID(),
    ...entry,
    createdAt: new Date(),
  };
  existing.push(newEntry);
  longMemory.set(scope, existing);
  return newEntry;
}

export function getLongMemory(scope: string, key?: string): LongMemoryEntry[] {
  const entries = longMemory.get(scope) ?? [];
  if (key) return entries.filter((e) => e.key === key);
  return entries;
}

export function clearLongMemory(scope: string): void {
  longMemory.delete(scope);
}
