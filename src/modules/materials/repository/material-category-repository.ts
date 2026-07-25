import type { MaterialCategory } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockCategories: MaterialCategory[] = [
  {
    id: 'mat-cat-001',
    name: 'Papéis e Cartões',
    icon: 'Package', color: '#3b82f6', sortOrder: 1, active: true, companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'mat-cat-002',
    name: 'Tintas e Vernizes',
    icon: 'Tool', color: '#ec4899', sortOrder: 2, active: true, companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'mat-cat-003',
    name: 'Adesivos',
    icon: 'Box', color: '#f59e0b', sortOrder: 3, active: false, companyId: COMPANY_ID,
    createdAt: new Date('2025-02-01'), updatedAt: new Date('2025-05-15'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class MaterialCategoryRepository extends BaseRepository<MaterialCategory, MaterialCategory, Partial<MaterialCategory>> {
  async findAll(): Promise<MaterialCategory[]> {
    return mockCategories
      .filter((c) => c.companyId === COMPANY_ID && !c.deletedAt)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async findById(id: string): Promise<MaterialCategory | null> {
    return mockCategories.find((c) => c.id === id && !c.deletedAt) ?? null;
  }

  async findMany(filter: Partial<MaterialCategory>): Promise<MaterialCategory[]> {
    return mockCategories.filter((c) =>
      Object.entries(filter).every(([key, value]) => c[key as keyof MaterialCategory] === value)
    );
  }

  async create(data: MaterialCategory): Promise<MaterialCategory> {
    const item: MaterialCategory = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockCategories.push(item);
    return item;
  }

  async update(id: string, data: Partial<MaterialCategory>): Promise<MaterialCategory> {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoria de material não encontrada');
    mockCategories[idx] = { ...mockCategories[idx], ...data, updatedAt: new Date() };
    return mockCategories[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoria de material não encontrada');
    mockCategories[idx] = { ...mockCategories[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<MaterialCategory> {
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Categoria de material não encontrada');
    mockCategories[idx] = { ...mockCategories[idx], deletedAt: null, updatedAt: new Date() };
    return mockCategories[idx];
  }

  async toggleActive(id: string): Promise<MaterialCategory> {
    const item = await this.findById(id);
    if (!item) throw new Error('Categoria de material não encontrada');
    return this.update(id, { active: !item.active });
  }
}

export const materialCategoryRepository = new MaterialCategoryRepository();
