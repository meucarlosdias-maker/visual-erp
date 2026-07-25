import type { ServiceSubcategory } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockSubcategories: ServiceSubcategory[] = [
  {
    id: 'sub-001', categoryId: 'cat-001',
    name: 'Sites Institucionais', description: 'Sites corporativos e institucionais',
    image: '', sortOrder: 1, active: true, companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'sub-002', categoryId: 'cat-001',
    name: 'E-commerce', description: 'Lojas virtuais e marketplaces',
    image: '', sortOrder: 2, active: true, companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class SubcategoryRepository {
  async list(companyId: string, categoryId?: string): Promise<ServiceSubcategory[]> {
    let result = mockSubcategories.filter((s) => s.companyId === companyId && !s.deletedAt);
    if (categoryId) result = result.filter((s) => s.categoryId === categoryId);
    return result.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getById(id: string): Promise<ServiceSubcategory | null> {
    return mockSubcategories.find((s) => s.id === id && !s.deletedAt) ?? null;
  }

  async create(data: ServiceSubcategory): Promise<ServiceSubcategory> {
    const item: ServiceSubcategory = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockSubcategories.push(item);
    return item;
  }

  async update(id: string, data: Partial<ServiceSubcategory>): Promise<ServiceSubcategory> {
    const idx = mockSubcategories.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Subcategoria não encontrada');
    mockSubcategories[idx] = { ...mockSubcategories[idx], ...data, updatedAt: new Date() };
    return mockSubcategories[idx];
  }

  async softDelete(id: string): Promise<void> {
    const idx = mockSubcategories.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Subcategoria não encontrada');
    mockSubcategories[idx] = { ...mockSubcategories[idx], deletedAt: new Date(), updatedAt: new Date() };
  }

  async toggleActive(id: string): Promise<ServiceSubcategory> {
    const item = await this.getById(id);
    if (!item) throw new Error('Subcategoria não encontrada');
    return this.update(id, { active: !item.active });
  }
}

export const subcategoryRepository = new SubcategoryRepository();
