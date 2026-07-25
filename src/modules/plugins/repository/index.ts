import type { PluginRecord, PluginExecutionRecord, PluginSettingRecord, PluginCategory, PluginSummary } from '@/core/plugins';

interface PluginRow {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  version: string;
  author: string | null;
  description: string | null;
  category: string;
  manifest: Record<string, unknown> | null;
  enabled: boolean;
  installedAt: Date;
  updatedAt: Date;
}

interface PluginSettingRow {
  id: string;
  pluginId: string;
  key: string;
  value: string;
}

interface PluginExecutionRow {
  id: string;
  pluginId: string;
  event: string;
  status: string;
  duration: number | null;
  error: string | null;
  createdAt: Date;
}

const plugins: PluginRow[] = [
  {
    id: 'plugin-1',
    companyId: 'company-1',
    name: 'Auditoria Visual',
    slug: 'auditoria-visual',
    version: '1.0.0',
    author: 'Visual ERP',
    description: 'Plugin de auditoria visual para os módulos do sistema.',
    category: 'analytics',
    manifest: {
      name: 'Auditoria Visual',
      version: '1.0.0',
      author: 'Visual ERP',
      description: 'Plugin de auditoria visual para os módulos do sistema.',
      permissions: ['audit.view', 'audit.export'],
      routes: [{ path: '/auditoria-visual', component: 'AuditDashboard', label: 'Auditoria Visual' }],
      menus: [{ label: 'Auditoria Visual', icon: 'ShieldX', path: '/app/auditoria-visual' }],
      events: ['ApplicationStarted', 'UserLoggedIn'],
      dependencies: [],
    },
    enabled: true,
    installedAt: new Date('2026-07-01'),
    updatedAt: new Date('2026-07-01'),
  },
  {
    id: 'plugin-2',
    companyId: 'company-1',
    name: 'Exportador de Dados',
    slug: 'exportador-de-dados',
    version: '1.0.0',
    author: 'Visual ERP',
    description: 'Plugin para exportação de dados em CSV, Excel e PDF.',
    category: 'integration',
    manifest: {
      name: 'Exportador de Dados',
      version: '1.0.0',
      author: 'Visual ERP',
      description: 'Plugin para exportação de dados em CSV, Excel e PDF.',
      permissions: ['data.export'],
      routes: [],
      menus: [],
      events: ['ProductionFinished', 'FinancialReceived'],
      dependencies: [],
    },
    enabled: true,
    installedAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-15'),
  },
  {
    id: 'plugin-3',
    companyId: 'company-1',
    name: 'Notificações SMS',
    slug: 'notificacoes-sms',
    version: '0.5.0',
    author: 'Visual ERP',
    description: 'Plugin para envio de notificações via SMS. Em desenvolvimento.',
    category: 'integration',
    manifest: {
      name: 'Notificações SMS',
      version: '0.5.0',
      author: 'Visual ERP',
      description: 'Plugin para envio de notificações via SMS.',
      permissions: ['notifications.send'],
      routes: [],
      menus: [],
      events: ['LeadCreated', 'QuoteApproved', 'ProjectCreated'],
      dependencies: ['api-sms'],
    },
    enabled: false,
    installedAt: new Date('2026-07-20'),
    updatedAt: new Date('2026-07-20'),
  },
];

const settings: PluginSettingRow[] = [
  { id: 'setting-1', pluginId: 'plugin-1', key: 'refresh_interval', value: '300' },
  { id: 'setting-2', pluginId: 'plugin-1', key: 'max_logs', value: '1000' },
  { id: 'setting-3', pluginId: 'plugin-2', key: 'default_format', value: 'csv' },
];

const executions: PluginExecutionRow[] = [
  { id: 'exec-1', pluginId: 'plugin-1', event: 'ApplicationStarted', status: 'completed', duration: 120, error: null, createdAt: new Date('2026-07-24T10:00:00') },
  { id: 'exec-2', pluginId: 'plugin-2', event: 'ProductionFinished', status: 'completed', duration: 85, error: null, createdAt: new Date('2026-07-24T09:30:00') },
  { id: 'exec-3', pluginId: 'plugin-1', event: 'UserLoggedIn', status: 'failed', duration: 0, error: 'Permissão negada', createdAt: new Date('2026-07-24T08:15:00') },
];

function toPluginRecord(row: PluginRow): PluginRecord {
  return {
    ...row,
    category: row.category as PluginCategory,
    manifest: row.manifest as PluginRecord['manifest'],
  };
}

export const PluginRepository = {
  async findAll(companyId: string): Promise<PluginRecord[]> {
    return plugins.filter((p) => p.companyId === companyId).map(toPluginRecord);
  },

  async findById(id: string): Promise<PluginRecord | null> {
    const row = plugins.find((p) => p.id === id);
    return row ? toPluginRecord(row) : null;
  },

  async findBySlug(slug: string): Promise<PluginRecord | null> {
    const row = plugins.find((p) => p.slug === slug);
    return row ? toPluginRecord(row) : null;
  },

  async create(data: Omit<PluginRecord, 'installedAt' | 'updatedAt'>): Promise<PluginRecord> {
    const row: PluginRow = {
      id: data.id,
      companyId: data.companyId,
      name: data.name,
      slug: data.slug,
      version: data.version,
      author: data.author,
      description: data.description,
      category: data.category,
      manifest: data.manifest as unknown as Record<string, unknown> | null,
      enabled: data.enabled,
      installedAt: new Date(),
      updatedAt: new Date(),
    };
    plugins.push(row);
    return toPluginRecord(row);
  },

  async update(id: string, data: Partial<PluginRecord>): Promise<PluginRecord | null> {
    const index = plugins.findIndex((p) => p.id === id);
    if (index === -1) return null;
    plugins[index] = {
      ...plugins[index],
      ...data,
      category: data.category ?? plugins[index].category,
      manifest: data.manifest !== undefined
        ? data.manifest as unknown as Record<string, unknown> | null
        : plugins[index].manifest,
      updatedAt: new Date(),
    };
    return toPluginRecord(plugins[index]);
  },

  async delete(id: string): Promise<boolean> {
    const index = plugins.findIndex((p) => p.id === id);
    if (index === -1) return false;
    plugins.splice(index, 1);
    return true;
  },

  async count(): Promise<number> {
    return plugins.length;
  },
};

export const PluginSettingRepository = {
  async findByPlugin(pluginId: string): Promise<PluginSettingRecord[]> {
    return settings.filter((s) => s.pluginId === pluginId).map((s) => ({ ...s }));
  },

  async upsert(pluginId: string, key: string, value: string): Promise<PluginSettingRecord> {
    const existing = settings.find((s) => s.pluginId === pluginId && s.key === key);
    if (existing) {
      existing.value = value;
      return { ...existing };
    }
    const row: PluginSettingRow = {
      id: `setting-${Date.now()}`,
      pluginId,
      key,
      value,
    };
    settings.push(row);
    return { ...row };
  },

  async delete(pluginId: string, key: string): Promise<boolean> {
    const index = settings.findIndex((s) => s.pluginId === pluginId && s.key === key);
    if (index === -1) return false;
    settings.splice(index, 1);
    return true;
  },
};

export const PluginExecutionRepository = {
  async findByPlugin(pluginId: string): Promise<PluginExecutionRecord[]> {
    return executions.filter((e) => e.pluginId === pluginId).map((e) => ({ ...e, status: e.status as PluginExecutionRecord['status'] }));
  },

  async findAll(): Promise<PluginExecutionRecord[]> {
    return executions.map((e) => ({ ...e, status: e.status as PluginExecutionRecord['status'] }));
  },

  async create(data: Omit<PluginExecutionRecord, 'id' | 'createdAt'>): Promise<PluginExecutionRecord> {
    const row: PluginExecutionRow = {
      id: `exec-${Date.now()}`,
      pluginId: data.pluginId,
      event: data.event,
      status: data.status,
      duration: data.duration,
      error: data.error,
      createdAt: new Date(),
    };
    executions.push(row);
    return { ...row, status: row.status as PluginExecutionRecord['status'] };
  },
};

export const MarketplaceRepository = {
  async search(_companyId: string): Promise<{ id: string; name: string; version: string; author: string; description: string; category: string; rating: number; downloads: number }[]> {
    return [
      { id: 'mp-1', name: 'Relatórios Avançados', version: '2.1.0', author: 'Visual ERP Labs', description: 'Relatórios personalizados com gráficos e dashboards.', category: 'analytics', rating: 4.5, downloads: 1280 },
      { id: 'mp-2', name: 'Integração Mercado Livre', version: '1.3.0', author: 'IntegraDev', description: 'Sincronize produtos e pedidos com o Mercado Livre.', category: 'integration', rating: 4.2, downloads: 890 },
      { id: 'mp-3', name: 'Chat Interno', version: '2.0.0', author: 'Visual ERP Labs', description: 'Sistema de chat interno para equipes.', category: 'ui', rating: 3.8, downloads: 2340 },
      { id: 'mp-4', name: 'Automação de E-mails', version: '1.0.0', author: 'EmailPro', description: 'Campanhas de e-mail automatizadas para leads e clientes.', category: 'automation', rating: 4.0, downloads: 560 },
      { id: 'mp-5', name: 'BI Corporativo', version: '3.0.0', author: 'DataVis', description: 'Business Intelligence com integração a múltiplas fontes.', category: 'analytics', rating: 4.8, downloads: 3200 },
    ];
  },
};

export { type PluginRow, type PluginSettingRow, type PluginExecutionRow };
