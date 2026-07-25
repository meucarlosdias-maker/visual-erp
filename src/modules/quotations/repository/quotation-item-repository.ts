import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { QuotationItem } from '../types';

let mockItems: QuotationItem[] = [
  {
    id: 'item-svc-001', quotationId: 'orc-001-v1', serviceId: 'svc-001',
    description: 'Instalação de Lona Oléfina', quantity: 1, unit: 'UN',
    unitPrice: 2355.50, totalPrice: 2355.50, pricingSnapshot: null, sortOrder: 0,
  },
  {
    id: 'item-svc-002', quotationId: 'orc-002-v2', serviceId: 'svc-002',
    description: 'Aplicação de Adesivo Vinílico', quantity: 1, unit: 'UN',
    unitPrice: 4250.00, totalPrice: 4250.00, pricingSnapshot: null, sortOrder: 0,
  },
  {
    id: 'item-svc-003', quotationId: 'orc-002-v1', serviceId: 'svc-002',
    description: 'Aplicação de Adesivo Vinílico', quantity: 1, unit: 'UN',
    unitPrice: 4000.00, totalPrice: 4000.00, pricingSnapshot: null, sortOrder: 0,
  },
  {
    id: 'item-svc-004', quotationId: 'orc-003-v1', serviceId: 'svc-003',
    description: 'Impressão Digital em ACM', quantity: 1, unit: 'UN',
    unitPrice: 6450.00, totalPrice: 6450.00, pricingSnapshot: null, sortOrder: 0,
  },
  {
    id: 'item-004-1', quotationId: 'orc-004-v1', serviceId: 'svc-003',
    description: 'Adesivo Vinílico', quantity: 14, unit: 'M2',
    unitPrice: 70.00, totalPrice: 980.00, pricingSnapshot: null, sortOrder: 0,
  },
  {
    id: 'item-004-2', quotationId: 'orc-004-v1', serviceId: null,
    description: 'Mão de obra instalação', quantity: 12, unit: 'HORAS',
    unitPrice: 50.00, totalPrice: 600.00, pricingSnapshot: null, sortOrder: 1,
  },
  {
    id: 'item-004-3', quotationId: 'orc-004-v1', serviceId: 'eq-001',
    description: 'Impressão digital', quantity: 14, unit: 'M2',
    unitPrice: 21.43, totalPrice: 300.00, pricingSnapshot: null, sortOrder: 2,
  },
  {
    id: 'item-004-4', quotationId: 'orc-004-v1', serviceId: null,
    description: 'Frete entrega', quantity: 1, unit: 'UN',
    unitPrice: 120.00, totalPrice: 120.00, pricingSnapshot: null, sortOrder: 3,
  },
];

export class QuotationItemRepository extends BaseRepository<QuotationItem, QuotationItem, Partial<QuotationItem>> {
  async findAll(_params?: PaginationInput): Promise<QuotationItem[]> {
    return [...mockItems];
  }

  async findById(id: string): Promise<QuotationItem | null> {
    return mockItems.find((i) => i.id === id) ?? null;
  }

  async findMany(filter: Partial<QuotationItem>): Promise<QuotationItem[]> {
    return mockItems.filter((i) =>
      Object.entries(filter).every(([key, value]) => (i as Record<string, unknown>)[key] === value)
    );
  }

  async create(data: QuotationItem): Promise<QuotationItem> {
    mockItems.push(data);
    return data;
  }

  async update(id: string, data: Partial<QuotationItem>): Promise<QuotationItem> {
    const idx = mockItems.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    mockItems[idx] = { ...mockItems[idx], ...data };
    return mockItems[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockItems.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    mockItems.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<QuotationItem> {
    const item = mockItems.find((i) => i.id === id);
    if (!item) throw new Error('Item not found');
    return item;
  }

  async listByQuotationId(quotationId: string): Promise<QuotationItem[]> {
    return mockItems
      .filter((i) => i.quotationId === quotationId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createMany(items: QuotationItem[]): Promise<QuotationItem[]> {
    mockItems.push(...items);
    return items;
  }

  async deleteByQuotationId(quotationId: string): Promise<void> {
    mockItems = mockItems.filter((i) => i.quotationId !== quotationId);
  }

  async reorder(quotationId: string, itemIds: string[]): Promise<QuotationItem[]> {
    const items = mockItems.filter((i) => i.quotationId === quotationId);
    const updated = items.map((item) => {
      const idx = itemIds.indexOf(item.id);
      return { ...item, sortOrder: idx >= 0 ? idx : item.sortOrder };
    });
    for (const u of updated) {
      const idx = mockItems.findIndex((i) => i.id === u.id);
      if (idx !== -1) mockItems[idx] = u;
    }
    return updated.sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export const quotationItemRepository = new QuotationItemRepository();
