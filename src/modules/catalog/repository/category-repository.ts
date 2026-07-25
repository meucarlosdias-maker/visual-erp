import type { ServiceCategory } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockCategories: ServiceCategory[] = [
  {
    id: 'cat-001',
    name: 'Desenvolvimento Web',
    description: 'Criação e manutenção de sites e sistemas web',
    icon: 'Globe',
    color: '#3b82f6',
    sortOrder: 1,
    active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-06-01'),
    deletedAt: null,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
  },
  {
    id: 'cat-002',
    name: 'Design Gráfico',
    description: 'Criação de identidade visual, artes e layouts',
    icon: 'Paintbrush',
    color: '#ec4899',
    sortOrder: 2,
    active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-06-01'),
    deletedAt: null,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
  },
  {
    id: 'cat-003',
    name: 'Consultoria',
    description: 'Serviços de consultoria técnica e estratégica',
    icon: 'Star',
    color: '#f59e0b',
    sortOrder: 3,
    active: false,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-05-15'),
    deletedAt: null,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
  },
];

export class CategoryRepository {
  async list(companyId: string): Promise<ServiceCategory[]> {
    return mockCategories
      .filter((c) => c.companyId === companyId && !c.deletedAt)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getById(id: string): Promise<ServiceCategory | null> {
    return mockCategories.find((c) => c.id === id && !c.deletedAt) ?? null;
  }

  async create(data: ServiceCategory): Promise<ServiceCategory> {
    const category: ServiceCategory = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCategories.push(category);
    return category;
  }

  async update(id: string, data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const index = mockCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Categoria não encontrada');
    mockCategories[index] = { ...mockCategories[index], ...data, updatedAt: new Date() };
    return mockCategories[index];
  }

  async softDelete(id: string): Promise<void> {
    const index = mockCategories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Categoria não encontrada');
    mockCategories[index] = {
      ...mockCategories[index],
      deletedAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async toggleActive(id: string): Promise<ServiceCategory> {
    const category = await this.getById(id);
    if (!category) throw new Error('Categoria não encontrada');
    return this.update(id, { active: !category.active });
  }
}

export const categoryRepository = new CategoryRepository();
