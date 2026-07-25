import type { CatalogService } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockServices: CatalogService[] = [
  {
    id: 'svc-001', categoryId: 'cat-001', subcategoryId: 'sub-001',
    code: 'WEB-0001', name: 'Site Institucional Padrão', description: 'Site institucional com 5 páginas',
    image: '', version: '1.0.0', averageProductionTime: 40,
    requiresVisit: false, requiresApproval: true, requiresArt: true,
    hasPrinting: false, hasInstallation: false, hasPainting: false, hasTransport: false,
    defaultMargin: 30, minimumMargin: 15, maximumMargin: 50,
    commission: 5, tax: 8, markup: 1.5, minimumCost: 2000, active: true,
    companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'svc-002', categoryId: 'cat-001', subcategoryId: 'sub-002',
    code: 'WEB-0002', name: 'Loja Virtual Básica', description: 'E-commerce com até 50 produtos',
    image: '', version: '1.0.0', averageProductionTime: 80,
    requiresVisit: false, requiresApproval: true, requiresArt: true,
    hasPrinting: false, hasInstallation: false, hasPainting: false, hasTransport: false,
    defaultMargin: 35, minimumMargin: 20, maximumMargin: 55,
    commission: 8, tax: 8, markup: 1.6, minimumCost: 5000, active: true,
    companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class ServiceRepository {
  async list(companyId: string, filters?: { categoryId?: string; subcategoryId?: string }): Promise<CatalogService[]> {
    let result = mockServices.filter((s) => s.companyId === companyId && !s.deletedAt);
    if (filters?.categoryId) result = result.filter((s) => s.categoryId === filters.categoryId);
    if (filters?.subcategoryId) result = result.filter((s) => s.subcategoryId === filters.subcategoryId);
    return result;
  }

  async getById(id: string): Promise<CatalogService | null> {
    return mockServices.find((s) => s.id === id && !s.deletedAt) ?? null;
  }

  async getByCode(code: string): Promise<CatalogService | null> {
    return mockServices.find((s) => s.code === code && !s.deletedAt) ?? null;
  }

  async create(data: CatalogService): Promise<CatalogService> {
    const item: CatalogService = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockServices.push(item);
    return item;
  }

  async update(id: string, data: Partial<CatalogService>): Promise<CatalogService> {
    const idx = mockServices.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Serviço não encontrado');
    mockServices[idx] = { ...mockServices[idx], ...data, updatedAt: new Date() };
    return mockServices[idx];
  }

  async softDelete(id: string): Promise<void> {
    const idx = mockServices.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Serviço não encontrado');
    mockServices[idx] = { ...mockServices[idx], deletedAt: new Date(), updatedAt: new Date() };
  }

  async toggleActive(id: string): Promise<CatalogService> {
    const item = await this.getById(id);
    if (!item) throw new Error('Serviço não encontrado');
    return this.update(id, { active: !item.active });
  }
}

export const serviceRepository = new ServiceRepository();
