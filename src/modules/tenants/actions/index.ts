'use client';

import type { TenantPlanInfo } from '@/core/tenant';
import { PlanService, SubscriptionService, CompanyService, CompanySettingsService } from '../services';

export async function updateCompany(companyId: string, data: Record<string, unknown>) {
  return CompanyService.update(companyId, data);
}

export async function createPlan(data: Parameters<typeof PlanService.create>[0]) {
  return PlanService.create(data);
}

export async function changePlan(companyId: string, planId: string) {
  return SubscriptionService.changePlan(companyId, planId);
}

export async function cancelSubscription(companyId: string) {
  return SubscriptionService.cancel(companyId);
}

export async function updateCompanySettings(companyId: string, data: Record<string, unknown>) {
  return CompanySettingsService.update(companyId, data);
}

export async function checkPlanLimits(plan: TenantPlanInfo) {
  const { tenantIsolation } = await import('@/core/tenant');
  return tenantIsolation.checkPlanLimits(
    { id: '', name: '', tradeName: null, document: null, email: null, phone: null, logoUrl: null, status: 'active', timezone: '', language: '', currency: '', planId: plan.id, plan },
    { users: 0, activeProjects: 0, clients: 0, storage: 0, integrations: 0, plugins: 0 },
  );
}
