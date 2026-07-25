import type { TenantPlanInfo, SubscriptionInfo, CompanySettingsInfo, TenantInfo } from '@/core/tenant';
import { tenantServiceCore, tenantIsolation } from '@/core/tenant';
import { TenantRepository, PlanRepository, SubscriptionRepository, CompanySettingsRepository } from '../repository';

export const CompanyService = {
  async getCurrent(companyId: string) {
    return TenantRepository.findCompany(companyId);
  },

  async update(companyId: string, data: Record<string, unknown>) {
    return TenantRepository.updateCompany(companyId, data);
  },

  async getDashboard(companyId: string) {
    const [company, plan, subscription, settings] = await Promise.all([
      TenantRepository.findCompany(companyId),
      (async () => {
        const sub = await SubscriptionRepository.findByCompany(companyId);
        return sub ? PlanRepository.findById(sub.planId) : null;
      })(),
      SubscriptionRepository.findByCompany(companyId),
      CompanySettingsRepository.findByCompany(companyId),
    ]);

    const usage = {
      users: 3,
      activeProjects: 5,
      clients: 28,
      storage: 256,
    };

    return { company, plan, subscription, settings, usage };
  },
};

export const PlanService = {
  async list(): Promise<TenantPlanInfo[]> {
    return PlanRepository.findAll();
  },

  async getById(id: string): Promise<TenantPlanInfo | null> {
    return PlanRepository.findById(id);
  },

  async create(data: Parameters<typeof PlanRepository.create>[0]): Promise<TenantPlanInfo> {
    return PlanRepository.create(data);
  },

  async update(id: string, data: Parameters<typeof PlanRepository.update>[1]): Promise<TenantPlanInfo | null> {
    return PlanRepository.update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return PlanRepository.delete(id);
  },

  async checkLimits(tenant: TenantInfo, usage: Parameters<typeof tenantIsolation.checkPlanLimits>[1]) {
    return tenantIsolation.checkPlanLimits(tenant, usage);
  },
};

export const SubscriptionService = {
  async getCurrent(companyId: string): Promise<SubscriptionInfo | null> {
    return SubscriptionRepository.findByCompany(companyId);
  },

  async changePlan(companyId: string, planId: string): Promise<SubscriptionInfo | null> {
    const plan = await PlanRepository.findById(planId);
    if (!plan) return null;
    return SubscriptionRepository.update(companyId, {
      planId,
      planName: plan.name,
    });
  },

  async cancel(companyId: string): Promise<boolean> {
    return SubscriptionRepository.cancel(companyId);
  },
};

export const CompanySettingsService = {
  async getCurrent(companyId: string): Promise<CompanySettingsInfo | null> {
    return CompanySettingsRepository.findByCompany(companyId);
  },

  async update(companyId: string, data: Record<string, unknown>): Promise<CompanySettingsInfo> {
    return CompanySettingsRepository.upsert(companyId, data);
  },
};
