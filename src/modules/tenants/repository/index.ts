import type { TenantPlanInfo, SubscriptionInfo, CompanySettingsInfo } from '@/core/tenant';

interface PlanRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  usersLimit: number;
  storageLimit: number;
  activeProjectsLimit: number;
  clientsLimit: number;
  integrationsLimit: number;
  aiLimit: boolean;
  pluginsLimit: number;
  features: Record<string, unknown> | null;
  active: boolean;
  sortOrder: number;
}

interface SubscriptionRow {
  id: string;
  companyId: string;
  planId: string;
  planName: string;
  status: string;
  startedAt: Date;
  expiresAt: Date | null;
  renewalDate: Date | null;
  paymentMethod: string | null;
}

interface CompanySettingsRow {
  id: string;
  companyId: string;
  theme: string;
  primaryColor: string;
  logoDarkUrl: string | null;
  logoLightUrl: string | null;
  faviconUrl: string | null;
  preferences: Record<string, unknown> | null;
}

const plans: PlanRow[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    description: 'Plano inicial para pequenas empresas',
    price: 49,
    currency: 'BRL',
    interval: 'monthly',
    usersLimit: 5,
    storageLimit: 1024,
    activeProjectsLimit: 10,
    clientsLimit: 50,
    integrationsLimit: 3,
    aiLimit: false,
    pluginsLimit: 3,
    features: { dashboard: true, crm: true, financial: true },
    active: true,
    sortOrder: 0,
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    description: 'Plano profissional para empresas em crescimento',
    price: 199,
    currency: 'BRL',
    interval: 'monthly',
    usersLimit: 20,
    storageLimit: 5120,
    activeProjectsLimit: 50,
    clientsLimit: 500,
    integrationsLimit: 10,
    aiLimit: true,
    pluginsLimit: 10,
    features: { dashboard: true, crm: true, financial: true, ai: true, api: true },
    active: true,
    sortOrder: 1,
  },
  {
    id: 'plan-business',
    name: 'Business',
    description: 'Plano empresarial com recursos avançados',
    price: 499,
    currency: 'BRL',
    interval: 'monthly',
    usersLimit: 50,
    storageLimit: 20480,
    activeProjectsLimit: 200,
    clientsLimit: 2000,
    integrationsLimit: 50,
    aiLimit: true,
    pluginsLimit: 50,
    features: { dashboard: true, crm: true, financial: true, ai: true, api: true, whiteLabel: true },
    active: true,
    sortOrder: 2,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'Plano enterprise com suporte dedicado',
    price: 999,
    currency: 'BRL',
    interval: 'monthly',
    usersLimit: 999999,
    storageLimit: 102400,
    activeProjectsLimit: 999999,
    clientsLimit: 99999,
    integrationsLimit: 999,
    aiLimit: true,
    pluginsLimit: 999,
    features: { dashboard: true, crm: true, financial: true, ai: true, api: true, whiteLabel: true, dedicated: true },
    active: true,
    sortOrder: 3,
  },
];

const subscriptions: SubscriptionRow[] = [
  {
    id: 'sub-company-1',
    companyId: 'company-1',
    planId: 'plan-professional',
    planName: 'Professional',
    status: 'active',
    startedAt: new Date('2026-01-01'),
    expiresAt: new Date('2027-01-01'),
    renewalDate: new Date('2026-08-01'),
    paymentMethod: 'credit_card',
  },
];

const settings: CompanySettingsRow[] = [
  {
    id: 'settings-company-1',
    companyId: 'company-1',
    theme: 'light',
    primaryColor: '#3b82f6',
    logoDarkUrl: null,
    logoLightUrl: null,
    faviconUrl: null,
    preferences: null,
  },
];

function toPlanInfo(row: PlanRow): TenantPlanInfo {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    usersLimit: row.usersLimit,
    storageLimit: row.storageLimit,
    activeProjectsLimit: row.activeProjectsLimit,
    clientsLimit: row.clientsLimit,
    integrationsLimit: row.integrationsLimit,
    aiLimit: row.aiLimit,
    pluginsLimit: row.pluginsLimit,
    features: row.features,
  };
}

export const TenantRepository = {
  async findCompany(_companyId: string): Promise<{ name: string; tradeName: string | null; document: string | null; email: string | null; phone: string | null; timezone: string; language: string; currency: string }> {
    return {
      name: 'Visual ERP Ltda',
      tradeName: 'Visual ERP',
      document: '12.345.678/0001-90',
      email: 'contato@visualerp.com.br',
      phone: '(11) 99999-8888',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      currency: 'BRL',
    };
  },

  async updateCompany(_companyId: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return data;
  },
};

export const PlanRepository = {
  async findAll(): Promise<TenantPlanInfo[]> {
    return plans.filter((p) => p.active).map(toPlanInfo);
  },

  async findById(id: string): Promise<TenantPlanInfo | null> {
    const row = plans.find((p) => p.id === id);
    return row ? toPlanInfo(row) : null;
  },

  async create(data: Omit<PlanRow, 'id'>): Promise<TenantPlanInfo> {
    const row: PlanRow = { id: `plan-${Date.now()}`, ...data };
    plans.push(row);
    return toPlanInfo(row);
  },

  async update(id: string, data: Partial<PlanRow>): Promise<TenantPlanInfo | null> {
    const index = plans.findIndex((p) => p.id === id);
    if (index === -1) return null;
    plans[index] = { ...plans[index], ...data };
    return toPlanInfo(plans[index]);
  },

  async delete(id: string): Promise<boolean> {
    const index = plans.findIndex((p) => p.id === id);
    if (index === -1) return false;
    plans.splice(index, 1);
    return true;
  },
};

export const SubscriptionRepository = {
  async findByCompany(companyId: string): Promise<SubscriptionInfo | null> {
    const row = subscriptions.find((s) => s.companyId === companyId);
    return row ? { ...row } : null;
  },

  async create(data: SubscriptionRow): Promise<SubscriptionInfo> {
    subscriptions.push(data);
    return { ...data };
  },

  async update(companyId: string, data: Partial<SubscriptionRow>): Promise<SubscriptionInfo | null> {
    const index = subscriptions.findIndex((s) => s.companyId === companyId);
    if (index === -1) return null;
    subscriptions[index] = { ...subscriptions[index], ...data };
    return { ...subscriptions[index] };
  },

  async cancel(companyId: string): Promise<boolean> {
    const index = subscriptions.findIndex((s) => s.companyId === companyId);
    if (index === -1) return false;
    subscriptions[index].status = 'cancelled';
    return true;
  },
};

export const CompanySettingsRepository = {
  async findByCompany(companyId: string): Promise<CompanySettingsInfo | null> {
    const row = settings.find((s) => s.companyId === companyId);
    return row ? { ...row } : null;
  },

  async upsert(companyId: string, data: Partial<CompanySettingsRow>): Promise<CompanySettingsInfo> {
    const index = settings.findIndex((s) => s.companyId === companyId);
    if (index !== -1) {
      settings[index] = { ...settings[index], ...data };
      return { ...settings[index] };
    }
    const row: CompanySettingsRow = {
      id: `settings-${companyId}`,
      companyId,
      theme: 'light',
      primaryColor: '#3b82f6',
      logoDarkUrl: null,
      logoLightUrl: null,
      faviconUrl: null,
      preferences: null,
      ...data,
    };
    settings.push(row);
    return { ...row };
  },
};
