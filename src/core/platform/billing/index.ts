import type { PlanDefinition } from '../types';

const plans: PlanDefinition[] = [
  { id: 'plan-001', name: 'Starter', price: 99, description: 'Para pequenas empresas', features: ['Até 5 usuários', '1GB storage', 'API básica'], limits: { users: 5, storage: 1024, apiCalls: 1000, aiCredits: 0, integrations: 2, plugins: false }, active: true, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
  { id: 'plan-002', name: 'Professional', price: 299, description: 'Para empresas em crescimento', features: ['Até 20 usuários', '10GB storage', 'API completa', 'IA incluída'], limits: { users: 20, storage: 10240, apiCalls: 10000, aiCredits: 1000, integrations: 5, plugins: true }, active: true, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
  { id: 'plan-003', name: 'Enterprise', price: 999, description: 'Para grandes empresas', features: ['Usuários ilimitados', 'Storage ilimitado', 'API dedicada', 'IA ilimitada', 'Suporte prioritário', 'Plugins ilimitados'], limits: { users: 999999, storage: 999999, apiCalls: 999999, aiCredits: 999999, integrations: 999, plugins: true }, active: true, createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
];

export function listPlans(): PlanDefinition[] { return [...plans]; }
export function getPlan(id: string): PlanDefinition | undefined { return plans.find((p) => p.id === id); }
export function createPlan(input: Omit<PlanDefinition, 'id' | 'createdAt' | 'updatedAt'>): PlanDefinition {
  const plan: PlanDefinition = { ...input, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
  plans.push(plan); return plan;
}
export function updatePlan(id: string, updates: Partial<Omit<PlanDefinition, 'id' | 'createdAt'>>): PlanDefinition | undefined {
  const idx = plans.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  plans[idx] = { ...plans[idx], ...updates, updatedAt: new Date() };
  return plans[idx];
}
export function deletePlan(id: string): boolean {
  const idx = plans.findIndex((p) => p.id === id);
  if (idx !== -1) { plans.splice(idx, 1); return true; }
  return false;
}
