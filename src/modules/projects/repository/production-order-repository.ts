import type { ProductionOrder } from '../types/production-order';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockOrders: ProductionOrder[] = [
  {
    id: 'po-001', companyId: COMPANY_ID, projectId: 'proj-001', projectTaskId: 'task-002',
    departmentId: 'dept-impressão', number: 'OP-2026-0001',
    title: 'Impressão digital — Instalação de Lona Oléfina',
    description: 'Imprimir lona oléfina para fachada', status: 'in_progress', priority: 'high',
    assignedTeamId: null, estimatedHours: 4, actualHours: null,
    startedAt: new Date('2026-02-07'), finishedAt: null,
    createdAt: new Date('2026-01-20'), updatedAt: new Date('2026-02-07'),
    deletedAt: null, createdBy: '', updatedBy: null, deletedBy: null,
  },
];

export class ProductionOrderRepository extends BaseRepository<ProductionOrder, ProductionOrder, Partial<ProductionOrder>> {
  async findAll(): Promise<ProductionOrder[]> {
    return mockOrders
      .filter((o) => !o.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<ProductionOrder | null> {
    return mockOrders.find((o) => o.id === id && !o.deletedAt) ?? null;
  }

  async findMany(filter: Partial<ProductionOrder>): Promise<ProductionOrder[]> {
    return mockOrders.filter((o) =>
      !o.deletedAt && Object.entries(filter).every(([key, value]) => o[key as keyof ProductionOrder] === value)
    );
  }

  async listByProjectId(projectId: string): Promise<ProductionOrder[]> {
    return mockOrders
      .filter((o) => o.projectId === projectId && !o.deletedAt)
      .sort((a, b) => a.number.localeCompare(b.number));
  }

  async listByTaskId(projectTaskId: string): Promise<ProductionOrder[]> {
    return mockOrders
      .filter((o) => o.projectTaskId === projectTaskId && !o.deletedAt);
  }

  async getNextNumber(companyId: string): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockOrders
      .filter((o) => o.companyId === companyId && o.number.startsWith(`OP-${year}`));
    const nums = existing.map((o) => {
      const parts = o.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `OP-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async create(data: ProductionOrder): Promise<ProductionOrder> {
    mockOrders.push(data);
    return data;
  }

  async update(id: string, data: Partial<ProductionOrder>): Promise<ProductionOrder> {
    const idx = mockOrders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Ordem de produção não encontrada');
    mockOrders[idx] = { ...mockOrders[idx], ...data, updatedAt: new Date() };
    return mockOrders[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockOrders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Ordem de produção não encontrada');
    mockOrders[idx] = { ...mockOrders[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<ProductionOrder> {
    const idx = mockOrders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Ordem de produção não encontrada');
    mockOrders[idx] = { ...mockOrders[idx], deletedAt: null, updatedAt: new Date() };
    return mockOrders[idx];
  }
}

export const productionOrderRepository = new ProductionOrderRepository();
