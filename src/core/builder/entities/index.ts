import type { CustomEntityRecord, EntitySummary } from '../types';

const entities: CustomEntityRecord[] = [];

export const EntityEngine = {
  async create(data: Omit<CustomEntityRecord, 'createdAt' | 'updatedAt'>): Promise<CustomEntityRecord> {
    const record: CustomEntityRecord = { ...data, createdAt: new Date(), updatedAt: new Date() };
    entities.push(record);
    return record;
  },

  async findById(id: string): Promise<CustomEntityRecord | null> {
    return entities.find((e) => e.id === id) ?? null;
  },

  async findByCompany(companyId: string): Promise<CustomEntityRecord[]> {
    return entities.filter((e) => e.companyId === companyId);
  },

  async findBySlug(slug: string): Promise<CustomEntityRecord | null> {
    return entities.find((e) => e.slug === slug) ?? null;
  },

  async update(id: string, data: Partial<CustomEntityRecord>): Promise<CustomEntityRecord | null> {
    const index = entities.findIndex((e) => e.id === id);
    if (index === -1) return null;
    entities[index] = { ...entities[index], ...data, updatedAt: new Date() };
    return entities[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = entities.findIndex((e) => e.id === id);
    if (index === -1) return false;
    entities.splice(index, 1);
    return true;
  },

  async getSummary(companyId: string, fieldCounts: Record<string, number>, recordCounts: Record<string, number>): Promise<EntitySummary[]> {
    const list = await EntityEngine.findByCompany(companyId);
    return list.map((e) => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description,
      icon: e.icon,
      color: e.color,
      active: e.active,
      fieldCount: fieldCounts[e.id] ?? 0,
      recordCount: recordCounts[e.id] ?? 0,
    }));
  },
};
