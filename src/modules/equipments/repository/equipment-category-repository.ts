import type { EquipmentCategory } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockCategories: EquipmentCategory[] = [
  { id: 'eq-cat-001', name: 'Impressão', description: 'Impressoras e equipamentos de impressão', icon: 'Wrench', color: '#3b82f6', sortOrder: 1, active: true, companyId: COMPANY_ID, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'), deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null },
  { id: 'eq-cat-002', name: 'Corte', description: 'Equipamentos de corte e acabamento', icon: 'Tool', color: '#ef4444', sortOrder: 2, active: true, companyId: COMPANY_ID, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'), deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null },
  { id: 'eq-cat-003', name: 'Transporte', description: 'Veículos e equipamentos de transporte', icon: 'Truck', color: '#10b981', sortOrder: 3, active: true, companyId: COMPANY_ID, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'), deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null },
  { id: 'eq-cat-004', name: 'Ferramentas', description: 'Ferramentas manuais e elétricas', icon: 'Settings', color: '#f59e0b', sortOrder: 4, active: false, companyId: COMPANY_ID, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-05-15'), deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null },
];

export class EquipmentCategoryRepository extends BaseRepository<EquipmentCategory, EquipmentCategory, Partial<EquipmentCategory>> {
  async findAll(): Promise<EquipmentCategory[]> {
    return mockCategories.filter((c) => c.companyId === COMPANY_ID && !c.deletedAt).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async findById(id: string): Promise<EquipmentCategory | null> {
    return mockCategories.find((c) => c.id === id && !c.deletedAt) ?? null;
  }

  async findMany(filter: Partial<EquipmentCategory>): Promise<EquipmentCategory[]> {
    return mockCategories.filter((c) =>
      Object.entries(filter).every(([key, value]) => c[key as keyof EquipmentCategory] === value)
    );
  }

  async create(data: EquipmentCategory): Promise<EquipmentCategory> {
    const item: EquipmentCategory = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockCategories.push(item);
    return item;
  }

  async update(id: string, data: Partial<EquipmentCategory>): Promise<EquipmentCategory> {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoria não encontrada');
    mockCategories[idx] = { ...mockCategories[idx], ...data, updatedAt: new Date() };
    return mockCategories[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoria não encontrada');
    mockCategories[idx] = { ...mockCategories[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<EquipmentCategory> {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoria não encontrada');
    mockCategories[idx] = { ...mockCategories[idx], deletedAt: null, updatedAt: new Date() };
    return mockCategories[idx];
  }

  async toggleActive(id: string): Promise<EquipmentCategory> {
    const item = await this.findById(id);
    if (!item) throw new Error('Categoria não encontrada');
    return this.update(id, { active: !item.active });
  }
}

export const equipmentCategoryRepository = new EquipmentCategoryRepository();
