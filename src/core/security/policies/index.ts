import type { SecurityPolicyDefinition, PolicyRule, PolicyEffect, PolicyRuleType } from '../types';

const policies: SecurityPolicyDefinition[] = [];

export function createPolicy(input: Omit<SecurityPolicyDefinition, 'id' | 'createdAt' | 'updatedAt'>): SecurityPolicyDefinition {
  const policy: SecurityPolicyDefinition = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  policies.push(policy);
  return policy;
}

export function updatePolicy(id: string, updates: Partial<Omit<SecurityPolicyDefinition, 'id' | 'createdAt'>>): SecurityPolicyDefinition | undefined {
  const idx = policies.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  policies[idx] = { ...policies[idx], ...updates, updatedAt: new Date() };
  return policies[idx];
}

export function deletePolicy(id: string): boolean {
  const idx = policies.findIndex((p) => p.id === id);
  if (idx !== -1) { policies.splice(idx, 1); return true; }
  return false;
}

export function getPolicy(id: string): SecurityPolicyDefinition | undefined {
  return policies.find((p) => p.id === id);
}

export function listPolicies(companyId?: string): SecurityPolicyDefinition[] {
  let result = [...policies];
  if (companyId) result = result.filter((p) => p.companyId === companyId);
  return result;
}

export function getActivePolicies(companyId: string): SecurityPolicyDefinition[] {
  return policies.filter((p) => p.companyId === companyId && p.active);
}

export function evaluatePolicy(companyId: string, ruleType: PolicyRuleType): PolicyRule[] {
  const active = getActivePolicies(companyId);
  const rules: PolicyRule[] = [];
  for (const policy of active) {
    for (const rule of policy.rules) {
      if (rule.type === ruleType) rules.push(rule);
    }
  }
  return rules.sort((a, b) => a.priority - b.priority);
}
