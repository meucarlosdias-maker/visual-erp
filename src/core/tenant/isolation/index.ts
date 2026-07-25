import type { TenantInfo, PlanLimits } from '../types';

class TenantIsolation {
  private currentTenantId: string | null = null;

  setCurrentTenant(tenantId: string): void {
    this.currentTenantId = tenantId;
  }

  getCurrentTenant(): string | null {
    return this.currentTenantId;
  }

  clearCurrentTenant(): void {
    this.currentTenantId = null;
  }

  addTenantFilter<T extends { companyId: string }>(items: T[], tenantId?: string): T[] {
    const id = tenantId ?? this.currentTenantId;
    if (!id) return items;
    return items.filter((item) => item.companyId === id);
  }

  validateAccess<T extends { companyId: string }>(item: T, tenantId?: string): boolean {
    const id = tenantId ?? this.currentTenantId;
    if (!id) return false;
    return item.companyId === id;
  }

  ensureIsolated<T extends { companyId: string }>(item: T, tenantId?: string): T {
    const id = tenantId ?? this.currentTenantId;
    if (!id) return item;
    if (item.companyId !== id) {
      throw new Error(`Acesso negado: empresa ${item.companyId} não pertence ao tenant ${id}`);
    }
    return item;
  }

  checkPlanLimits(tenant: TenantInfo, usage: Partial<PlanLimits>): { allowed: boolean; limits: PlanLimits; violations: string[] } {
    const plan = tenant.plan;
    const limits: PlanLimits = {
      users: plan?.usersLimit ?? 5,
      storage: plan?.storageLimit ?? 1024,
      activeProjects: plan?.activeProjectsLimit ?? 10,
      clients: plan?.clientsLimit ?? 50,
      integrations: plan?.integrationsLimit ?? 3,
      ai: plan?.aiLimit ?? false,
      plugins: plan?.pluginsLimit ?? 0,
    };

    const violations: string[] = [];

    if (usage.users !== undefined && usage.users > limits.users) {
      violations.push(`Limite de usuários excedido (${usage.users}/${limits.users})`);
    }
    if (usage.activeProjects !== undefined && usage.activeProjects > limits.activeProjects) {
      violations.push(`Limite de projetos ativos excedido (${usage.activeProjects}/${limits.activeProjects})`);
    }
    if (usage.clients !== undefined && usage.clients > limits.clients) {
      violations.push(`Limite de clientes excedido (${usage.clients}/${limits.clients})`);
    }
    if (usage.integrations !== undefined && usage.integrations > limits.integrations) {
      violations.push(`Limite de integrações excedido (${usage.integrations}/${limits.integrations})`);
    }
    if (usage.plugins !== undefined && usage.plugins > limits.plugins) {
      violations.push(`Limite de plugins excedido (${usage.plugins}/${limits.plugins})`);
    }
    if (usage.storage !== undefined && usage.storage > limits.storage) {
      violations.push(`Limite de armazenamento excedido (${usage.storage}MB/${limits.storage}MB)`);
    }

    return { allowed: violations.length === 0, limits, violations };
  }
}

export const tenantIsolation = new TenantIsolation();
