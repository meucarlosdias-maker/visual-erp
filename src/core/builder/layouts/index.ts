import type { CustomLayoutRecord, LayoutComponent, LayoutComponentType } from '../types';

const layouts: CustomLayoutRecord[] = [];

export const LayoutEngine = {
  async create(data: {
    entityId: string; name: string; layout: LayoutComponent[]; active?: boolean;
  }): Promise<CustomLayoutRecord> {
    const existing = layouts.filter((l) => l.entityId === data.entityId);
    const record: CustomLayoutRecord = {
      id: `lay-${crypto.randomUUID().slice(0, 8)}`,
      entityId: data.entityId,
      name: data.name,
      layout: data.layout,
      version: existing.length + 1,
      active: data.active ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    layouts.push(record);
    return record;
  },

  async findByEntity(entityId: string): Promise<CustomLayoutRecord[]> {
    return layouts.filter((l) => l.entityId === entityId).sort((a, b) => b.version - a.version);
  },

  async findById(id: string): Promise<CustomLayoutRecord | null> {
    return layouts.find((l) => l.id === id) ?? null;
  },

  async findActiveByEntity(entityId: string): Promise<CustomLayoutRecord | null> {
    return layouts.find((l) => l.entityId === entityId && l.active) ?? null;
  },

  async update(id: string, data: Partial<CustomLayoutRecord>): Promise<CustomLayoutRecord | null> {
    const index = layouts.findIndex((l) => l.id === id);
    if (index === -1) return null;
    layouts[index] = { ...layouts[index], ...data, updatedAt: new Date() };
    return layouts[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = layouts.findIndex((l) => l.id === id);
    if (index === -1) return false;
    layouts.splice(index, 1);
    return true;
  },

  async activate(id: string): Promise<CustomLayoutRecord | null> {
    const layout = await LayoutEngine.findById(id);
    if (!layout) return null;
    const entityLayouts = layouts.filter((l) => l.entityId === layout.entityId);
    for (const l of entityLayouts) {
      l.active = l.id === id;
    }
    return LayoutEngine.findById(id);
  },

  createComponent(type: LayoutComponentType, title?: string, config?: Record<string, unknown>): LayoutComponent {
    return {
      id: `comp-${crypto.randomUUID().slice(0, 8)}`,
      type,
      title,
      children: [],
      fieldIds: [],
      config,
      columns: type === 'grid' || type === 'columns' ? 2 : undefined,
    };
  },

  getAvailableComponents(): { type: LayoutComponentType; label: string; description: string }[] {
    return [
      { type: 'tabs', label: 'Abas', description: 'Organiza conteúdo em abas' },
      { type: 'section', label: 'Seção', description: 'Agrupa campos em uma seção' },
      { type: 'grid', label: 'Grade', description: 'Layout em grade' },
      { type: 'columns', label: 'Colunas', description: 'Layout em colunas' },
      { type: 'card', label: 'Card', description: 'Cartão com borda' },
      { type: 'accordion', label: 'Acordeão', description: 'Seção expansível' },
    ];
  },
};
