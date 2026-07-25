import type { PlatformUserDefinition, PlatformUserRole } from '../types';

const users: PlatformUserDefinition[] = [
  { id: 'pu-001', name: 'Super Admin', email: 'admin@visualerp.com', role: 'super_admin', active: true, lastLogin: new Date('2026-07-20T08:00:00'), createdAt: new Date('2025-01-01'), updatedAt: new Date('2026-07-20') },
  { id: 'pu-002', name: 'Suporte Técnico', email: 'suporte@visualerp.com', role: 'support', active: true, lastLogin: new Date('2026-07-19T14:00:00'), createdAt: new Date('2025-06-01'), updatedAt: new Date('2026-07-19') },
  { id: 'pu-003', name: 'Financeiro', email: 'billing@visualerp.com', role: 'billing', active: true, lastLogin: new Date('2026-07-18T10:00:00'), createdAt: new Date('2025-06-01'), updatedAt: new Date('2026-07-18') },
];

export function listPlatformUsers(): PlatformUserDefinition[] { return [...users]; }
export function getPlatformUser(id: string): PlatformUserDefinition | undefined { return users.find((u) => u.id === id); }
export function getPlatformUserByEmail(email: string): PlatformUserDefinition | undefined { return users.find((u) => u.email === email); }
export function createPlatformUser(input: Omit<PlatformUserDefinition, 'id' | 'createdAt' | 'updatedAt'>): PlatformUserDefinition {
  const user: PlatformUserDefinition = { ...input, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
  users.push(user); return user;
}
export function updatePlatformUser(id: string, updates: Partial<Omit<PlatformUserDefinition, 'id' | 'createdAt'>>): PlatformUserDefinition | undefined {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date() };
  return users[idx];
}
export function isSuperAdmin(userId: string): boolean {
  const user = users.find((u) => u.id === userId);
  return user?.role === 'super_admin';
}
export function hasPlatformAccess(userId: string): boolean {
  const user = users.find((u) => u.id === userId);
  return !!user?.active;
}
