import type { MessageTemplateRecord, TemplateCategory, TemplateFilter } from '../types';

const templates: MessageTemplateRecord[] = [];

const defaultVariables = ['{{cliente}}', '{{projeto}}', '{{valor}}', '{{vencimento}}'];

export const TemplateEngine = {
  async create(data: Omit<MessageTemplateRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MessageTemplateRecord> {
    const record: MessageTemplateRecord = {
      ...data,
      id: `tpl-${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    templates.push(record);
    return record;
  },

  async findById(id: string): Promise<MessageTemplateRecord | null> {
    return templates.find((t) => t.id === id) ?? null;
  },

  async findByCompany(companyId: string, filter?: TemplateFilter): Promise<MessageTemplateRecord[]> {
    let result = templates.filter((t) => t.companyId === companyId);

    if (filter) {
      if (filter.category) result = result.filter((t) => t.category === filter.category);
      if (filter.active !== undefined) result = result.filter((t) => t.active === filter.active);
      if (filter.search) {
        const term = filter.search.toLowerCase();
        result = result.filter((t) =>
          t.name.toLowerCase().includes(term) || t.content.toLowerCase().includes(term),
        );
      }
    }

    return result;
  },

  async update(id: string, data: Partial<MessageTemplateRecord>): Promise<MessageTemplateRecord | null> {
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;
    templates[index] = { ...templates[index], ...data, updatedAt: new Date() };
    return templates[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return false;
    templates.splice(index, 1);
    return true;
  },

  renderContent(template: MessageTemplateRecord, variables: Record<string, string>): string {
    let content = template.content;
    const allVars = template.variables ?? defaultVariables;
    for (const v of allVars) {
      const key = v.replace(/{{|}}/g, '');
      if (variables[key] !== undefined) {
        content = content.replace(new RegExp(v.replace(/[{}]/g, '\\$&'), 'g'), variables[key]);
      }
    }
    return content;
  },

  extractVariables(content: string): string[] {
    const matches = content.match(/{{[^}]+}}/g);
    return matches ?? [];
  },

  getCategories(): { value: TemplateCategory; label: string }[] {
    return [
      { value: 'commercial', label: 'Comercial' },
      { value: 'financial', label: 'Financeiro' },
      { value: 'billing', label: 'Cobrança' },
      { value: 'production', label: 'Produção' },
      { value: 'installation', label: 'Instalação' },
      { value: 'pos_sale', label: 'Pós-venda' },
      { value: 'support', label: 'Suporte' },
      { value: 'general', label: 'Geral' },
    ];
  },

  _getAll(): MessageTemplateRecord[] {
    return templates;
  },
};
