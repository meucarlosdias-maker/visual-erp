import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { WorkOrderItem } from '../types';

const mockItems: WorkOrderItem[] = [
  {
    id: 'woi-001', workOrderId: 'wo-001',
    serviceId: null, description: 'Lona Oléfina - Fachada',
    quantity: 1, unit: 'm2', width: 5, height: 3, area: 15, perimeter: 16,
    unitPrice: 1200, totalPrice: 18000,
    productionSector: 'costura', installationRequired: true,
    notes: '', sortOrder: 1,
  },
  {
    id: 'woi-002', workOrderId: 'wo-001',
    serviceId: null, description: 'Acabamento em Alumínio',
    quantity: 16, unit: 'm', width: 0, height: 0, area: 0, perimeter: 16,
    unitPrice: 250, totalPrice: 4000,
    productionSector: 'serralheria', installationRequired: true,
    notes: 'Perfil 20x20', sortOrder: 2,
  },
  {
    id: 'woi-003', workOrderId: 'wo-002',
    serviceId: null, description: 'Adesivo Vinílico',
    quantity: 50, unit: 'm2', width: 0, height: 0, area: 50, perimeter: 0,
    unitPrice: 170, totalPrice: 8500,
    productionSector: 'aplicacao', installationRequired: true,
    notes: '', sortOrder: 1,
  },
];

export class WorkOrderItemRepository extends BaseRepository<WorkOrderItem, WorkOrderItem, Partial<WorkOrderItem>> {
  async findAll(_params?: PaginationInput): Promise<WorkOrderItem[]> {
    return [...mockItems];
  }

  async findById(id: string): Promise<WorkOrderItem | null> {
    return mockItems.find((i) => i.id === id) ?? null;
  }

  async findMany(filter: Partial<WorkOrderItem>): Promise<WorkOrderItem[]> {
    return mockItems.filter((i) =>
      Object.entries(filter).every(([key, value]) => (i as Record<string, unknown>)[key] === value)
    );
  }

  async create(data: WorkOrderItem): Promise<WorkOrderItem> {
    mockItems.push(data);
    return data;
  }

  async update(id: string, data: Partial<WorkOrderItem>): Promise<WorkOrderItem> {
    const idx = mockItems.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Item não encontrado');
    mockItems[idx] = { ...mockItems[idx], ...data };
    return mockItems[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockItems.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    mockItems.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<WorkOrderItem> {
    const item = mockItems.find((i) => i.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  }

  async listByWorkOrderId(workOrderId: string): Promise<WorkOrderItem[]> {
    return mockItems
      .filter((i) => i.workOrderId === workOrderId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export const workOrderItemRepository = new WorkOrderItemRepository();
