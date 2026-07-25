import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { WorkOrder } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockWorkOrders: WorkOrder[] = [
  {
    id: 'wo-001', companyId: COMPANY_ID, number: 'OS-2026-0001',
    projectId: 'proj-001', quotationId: 'orc-001-v1', clientId: 'cliente-001',
    visitId: 'vis-002', installationId: null,
    status: 'IN_PRODUCTION', priority: 'HIGH',
    title: 'Instalação de Lona Oléfina - Tech Solutions',
    description: 'Instalação completa de lona oléfna na fachada.',
    startDate: new Date('2026-07-21'), expectedEndDate: new Date('2026-07-28'),
    finishedDate: null, totalValue: 25000,
    notes: 'Cliente solicita atenção ao acabamento.', internalNotes: '',
    createdAt: new Date('2026-07-20'), updatedAt: new Date('2026-07-21'),
    deletedAt: null, createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'wo-002', companyId: COMPANY_ID, number: 'OS-2026-0002',
    projectId: null, quotationId: null, clientId: null,
    visitId: null, installationId: null,
    status: 'OPEN', priority: 'NORMAL',
    title: 'Aplicação de Adesivo Vinílico - Loja do Centro',
    description: 'Aplicação de adesivo vinílico em loja de 50m².',
    startDate: null, expectedEndDate: null, finishedDate: null, totalValue: 8500,
    notes: '', internalNotes: '',
    createdAt: new Date('2026-07-22'), updatedAt: new Date('2026-07-22'),
    deletedAt: null, createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
  {
    id: 'wo-003', companyId: COMPANY_ID, number: 'OS-2026-0003',
    projectId: 'proj-002', quotationId: null, clientId: 'cliente-002',
    visitId: null, installationId: null,
    status: 'FINISHED', priority: 'NORMAL',
    title: 'Troca de Lonas - Galpão Industrial',
    description: 'Substituição de lonas danificadas no galpão.',
    startDate: new Date('2026-07-10'), expectedEndDate: new Date('2026-07-17'),
    finishedDate: new Date('2026-07-16'), totalValue: 12000,
    notes: 'Serviço concluído dentro do prazo.', internalNotes: '',
    createdAt: new Date('2026-07-09'), updatedAt: new Date('2026-07-16'),
    deletedAt: null, createdBy: 'user-001', updatedBy: 'user-001', deletedBy: null,
  },
];

export class WorkOrderRepository extends BaseRepository<WorkOrder, WorkOrder, Partial<WorkOrder>> {
  async findAll(_params?: PaginationInput): Promise<WorkOrder[]> {
    return mockWorkOrders
      .filter((o) => !o.deletedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<WorkOrder | null> {
    return mockWorkOrders.find((o) => o.id === id && !o.deletedAt) ?? null;
  }

  async findMany(filter: Partial<WorkOrder>): Promise<WorkOrder[]> {
    return mockWorkOrders.filter((o) =>
      !o.deletedAt &&
      Object.entries(filter).every(([key, value]) => (o as Record<string, unknown>)[key] === value)
    );
  }

  async create(data: WorkOrder): Promise<WorkOrder> {
    mockWorkOrders.push(data);
    return data;
  }

  async update(id: string, data: Partial<WorkOrder>): Promise<WorkOrder> {
    const idx = mockWorkOrders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('OS não encontrada');
    mockWorkOrders[idx] = { ...mockWorkOrders[idx], ...data, updatedAt: new Date() };
    return mockWorkOrders[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockWorkOrders.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    mockWorkOrders.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<WorkOrder> {
    const idx = mockWorkOrders.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('OS não encontrada');
    mockWorkOrders[idx] = { ...mockWorkOrders[idx], deletedAt: null, deletedBy: null };
    return mockWorkOrders[idx];
  }

  async getNextNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const existing = mockWorkOrders.filter((o) => o.number.startsWith(`OS-${year}`));
    const nums = existing.map((o) => {
      const parts = o.number.split('-');
      return parseInt(parts[parts.length - 1], 10);
    }).filter((n) => !isNaN(n));
    const nextSeq = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    return `OS-${year}-${String(nextSeq).padStart(4, '0')}`;
  }

  async listByStatus(companyId: string, status: string): Promise<WorkOrder[]> {
    return mockWorkOrders.filter((o) => !o.deletedAt && o.status === status);
  }

  async getStatusCounts(_companyId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    for (const o of mockWorkOrders) {
      if (!o.deletedAt) {
        counts[o.status] = (counts[o.status] || 0) + 1;
      }
    }
    return counts;
  }
}

export const workOrderRepository = new WorkOrderRepository();
