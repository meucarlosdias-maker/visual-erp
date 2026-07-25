import type { TenantInfo, TenantPlanInfo, TenantContextData, TenantStatus } from '../types';

class TenantServiceCore {
  async getTenantInfo(tenantId: string): Promise<TenantInfo> {
    return {
      id: tenantId,
      name: tenantId === 'company-1' ? 'Visual ERP Ltda' : `Empresa ${tenantId}`,
      tradeName: tenantId === 'company-1' ? 'Visual ERP' : null,
      document: tenantId === 'company-1' ? '12.345.678/0001-90' : null,
      email: tenantId === 'company-1' ? 'contato@visualerp.com.br' : null,
      phone: tenantId === 'company-1' ? '(11) 99999-8888' : null,
      logoUrl: null,
      status: 'active' as TenantStatus,
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      currency: 'BRL',
      planId: tenantId === 'company-1' ? 'plan-professional' : 'plan-starter',
      plan: {
        id: tenantId === 'company-1' ? 'plan-professional' : 'plan-starter',
        name: tenantId === 'company-1' ? 'Professional' : 'Starter',
        description: tenantId === 'company-1' ? 'Plano profissional para empresas' : 'Plano inicial para pequenas empresas',
        price: tenantId === 'company-1' ? 199 : 49,
        usersLimit: tenantId === 'company-1' ? 20 : 5,
        storageLimit: 5120,
        activeProjectsLimit: tenantId === 'company-1' ? 50 : 10,
        clientsLimit: tenantId === 'company-1' ? 500 : 50,
        integrationsLimit: tenantId === 'company-1' ? 10 : 3,
        aiLimit: tenantId === 'company-1',
        pluginsLimit: tenantId === 'company-1' ? 10 : 3,
        features: null,
      },
    };
  }

  async getTenantContext(tenantId: string): Promise<TenantContextData> {
    const tenant = await this.getTenantInfo(tenantId);
    return {
      tenant,
      subscription: {
        id: `sub-${tenantId}`,
        companyId: tenantId,
        planId: tenant.plan?.id ?? '',
        planName: tenant.plan?.name ?? '',
        status: 'active',
        startedAt: new Date('2026-01-01'),
        expiresAt: new Date('2027-01-01'),
        renewalDate: new Date('2026-08-01'),
        paymentMethod: 'credit_card',
      },
      settings: {
        id: `settings-${tenantId}`,
        companyId: tenantId,
        theme: 'light',
        primaryColor: '#3b82f6',
        logoDarkUrl: null,
        logoLightUrl: null,
        faviconUrl: null,
        preferences: null,
      },
    };
  }
}

export const tenantServiceCore = new TenantServiceCore();
