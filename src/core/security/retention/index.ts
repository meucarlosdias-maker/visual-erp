import type { RetentionPolicyDefinition } from '../types';

const policies: RetentionPolicyDefinition[] = [];

export function createRetentionPolicy(input: Omit<RetentionPolicyDefinition, 'id' | 'createdAt' | 'updatedAt'>): RetentionPolicyDefinition {
  const policy: RetentionPolicyDefinition = {
    ...input, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date(),
  };
  policies.push(policy);
  return policy;
}

export function updateRetentionPolicy(id: string, updates: Partial<Omit<RetentionPolicyDefinition, 'id' | 'createdAt'>>): RetentionPolicyDefinition | undefined {
  const idx = policies.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  policies[idx] = { ...policies[idx], ...updates, updatedAt: new Date() };
  return policies[idx];
}

export function deleteRetentionPolicy(id: string): boolean {
  const idx = policies.findIndex((p) => p.id === id);
  if (idx !== -1) { policies.splice(idx, 1); return true; }
  return false;
}

export function getRetentionPolicy(id: string): RetentionPolicyDefinition | undefined {
  return policies.find((p) => p.id === id);
}

export function listRetentionPolicies(companyId?: string): RetentionPolicyDefinition[] {
  let result = [...policies];
  if (companyId) result = result.filter((p) => p.companyId === companyId);
  return result;
}

export function getPolicyForEntity(companyId: string, entity: string): RetentionPolicyDefinition | undefined {
  return policies.find((p) => p.companyId === companyId && p.entity === entity && p.active);
}

export function calculateRetentionDate(policy: RetentionPolicyDefinition): Date {
  const now = new Date();
  return new Date(now.getTime() - policy.retentionDays * 24 * 60 * 60 * 1000);
}
