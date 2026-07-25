import type { Material } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockMaterials: Material[] = [
  {
    id: 'mat-001', categoryId: 'mat-cat-001',
    code: 'PAP-0001', name: 'Papel Couchê 90g',
    brand: 'Suzano', manufacturer: 'Suzano', supplier: 'Distribuidora ABC',
    unit: 'UN', cost: 0.85, salePrice: 1.50, lossPercent: 5,
    minimumStock: 500, currentStock: 2000,
    weight: null, width: 210, height: 297, thickness: null,
    color: 'Branco', reference: 'COUCHE-90-A4', barcode: '7890000000001', notes: '',
    active: true, companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'mat-002', categoryId: 'mat-cat-001',
    code: 'PAP-0002', name: 'Papel Sulfite A4 75g',
    brand: 'Chamex', manufacturer: 'Chamex', supplier: 'Distribuidora ABC',
    unit: 'PACOTE', cost: 12.00, salePrice: 18.90, lossPercent: 3,
    minimumStock: 20, currentStock: 100,
    weight: null, width: 210, height: 297, thickness: null,
    color: 'Branco', reference: 'SULFITE-75-A4', barcode: '7890000000002', notes: '',
    active: true, companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'mat-003', categoryId: 'mat-cat-002',
    code: 'TIN-0001', name: 'Tinta HP 664 Preto',
    brand: 'HP', manufacturer: 'HP', supplier: 'LojaTech',
    unit: 'UN', cost: 35.00, salePrice: 59.90, lossPercent: 0,
    minimumStock: 5, currentStock: 12,
    weight: 0.050, width: null, height: null, thickness: null,
    color: 'Preto', reference: 'HP664-BK', barcode: '7890000000003', notes: '',
    active: true, companyId: COMPANY_ID,
    createdAt: new Date(), updatedAt: new Date(),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class MaterialRepository extends BaseRepository<Material, Material, Partial<Material>> {
  async findAll(): Promise<Material[]> {
    return mockMaterials.filter((m) => m.companyId === COMPANY_ID && !m.deletedAt);
  }

  async findById(id: string): Promise<Material | null> {
    return mockMaterials.find((m) => m.id === id && !m.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Material>): Promise<Material[]> {
    return mockMaterials.filter((m) =>
      Object.entries(filter).every(([key, value]) => m[key as keyof Material] === value)
    );
  }

  async getByCode(code: string): Promise<Material | null> {
    return mockMaterials.find((m) => m.code === code && !m.deletedAt) ?? null;
  }

  async create(data: Material): Promise<Material> {
    const item: Material = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockMaterials.push(item);
    return item;
  }

  async update(id: string, data: Partial<Material>): Promise<Material> {
    const idx = mockMaterials.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Material não encontrado');
    mockMaterials[idx] = { ...mockMaterials[idx], ...data, updatedAt: new Date() };
    return mockMaterials[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockMaterials.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Material não encontrado');
    mockMaterials[idx] = { ...mockMaterials[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<Material> {
    const idx = mockMaterials.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Material não encontrado');
    mockMaterials[idx] = { ...mockMaterials[idx], deletedAt: null, updatedAt: new Date() };
    return mockMaterials[idx];
  }

  async toggleActive(id: string): Promise<Material> {
    const item = await this.findById(id);
    if (!item) throw new Error('Material não encontrado');
    return this.update(id, { active: !item.active });
  }
}

export const materialRepository = new MaterialRepository();
