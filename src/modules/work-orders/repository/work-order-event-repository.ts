import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { WorkOrderEvent } from '../types';

const mockEvents: WorkOrderEvent[] = [
  {
    id: 'woe-001', workOrderId: 'wo-001',
    type: 'CREATED', description: 'OS criada',
    userId: 'user-001',
    createdAt: new Date('2026-07-20'),
  },
  {
    id: 'woe-002', workOrderId: 'wo-001',
    type: 'STATUS_CHANGE', description: 'Status alterado para Em Produção',
    userId: 'user-001',
    createdAt: new Date('2026-07-21'),
  },
  {
    id: 'woe-003', workOrderId: 'wo-003',
    type: 'CREATED', description: 'OS criada',
    userId: 'user-001',
    createdAt: new Date('2026-07-09'),
  },
  {
    id: 'woe-004', workOrderId: 'wo-003',
    type: 'STATUS_CHANGE', description: 'Status alterado para Concluída',
    userId: 'user-001',
    createdAt: new Date('2026-07-16'),
  },
];

export class WorkOrderEventRepository extends BaseRepository<WorkOrderEvent, WorkOrderEvent, Partial<WorkOrderEvent>> {
  async findAll(_params?: PaginationInput): Promise<WorkOrderEvent[]> {
    return [...mockEvents];
  }

  async findById(id: string): Promise<WorkOrderEvent | null> {
    return mockEvents.find((e) => e.id === id) ?? null;
  }

  async findMany(filter: Partial<WorkOrderEvent>): Promise<WorkOrderEvent[]> {
    return mockEvents.filter((e) =>
      Object.entries(filter).every(([key, value]) => (e as Record<string, unknown>)[key] === value)
    );
  }

  async create(data: WorkOrderEvent): Promise<WorkOrderEvent> {
    mockEvents.push(data);
    return data;
  }

  async update(id: string, data: Partial<WorkOrderEvent>): Promise<WorkOrderEvent> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Event not found');
    mockEvents[idx] = { ...mockEvents[idx], ...data };
    return mockEvents[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockEvents.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    mockEvents.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<WorkOrderEvent> {
    const event = mockEvents.find((e) => e.id === id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async listByWorkOrderId(workOrderId: string): Promise<WorkOrderEvent[]> {
    return mockEvents
      .filter((e) => e.workOrderId === workOrderId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const workOrderEventRepository = new WorkOrderEventRepository();
