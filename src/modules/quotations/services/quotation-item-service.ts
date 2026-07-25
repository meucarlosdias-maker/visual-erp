import { BaseService } from '@/lib/service-base';
import { quotationItemRepository } from '../repository/quotation-item-repository';
import { quotationItemSchema } from '../schemas/quotation-schema';
import type { QuotationItem } from '../types';
import type { QuotationItemRepository } from '../repository/quotation-item-repository';

export class QuotationItemService extends BaseService<QuotationItem, Record<string, unknown>, Record<string, unknown>, QuotationItemRepository> {
  protected entityName = 'QuotationItem';

  constructor() {
    super(quotationItemRepository);
  }

  async listByQuotationId(quotationId: string): Promise<QuotationItem[]> {
    return this.repository.listByQuotationId(quotationId);
  }

  async create(data: Record<string, unknown>): Promise<QuotationItem> {
    const parsed = quotationItemSchema.parse({
      ...data,
      id: crypto.randomUUID(),
    });
    return this.repository.create(parsed);
  }

  async createMany(quotationId: string, items: Record<string, unknown>[]): Promise<QuotationItem[]> {
    const parsed = items.map((item, idx) =>
      quotationItemSchema.parse({
        ...item,
        id: crypto.randomUUID(),
        quotationId,
        sortOrder: item.sortOrder ?? idx,
      }),
    );
    return this.repository.createMany(parsed);
  }

  async update(id: string, data: Record<string, unknown>): Promise<QuotationItem> {
    return this.repository.update(id, data);
  }

  async deleteByQuotationId(quotationId: string): Promise<void> {
    return this.repository.deleteByQuotationId(quotationId);
  }

  async reorder(quotationId: string, itemIds: string[]): Promise<QuotationItem[]> {
    return this.repository.reorder(quotationId, itemIds);
  }

  calculateTotalPrice(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  calculateSubtotal(items: QuotationItem[]): number {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
}

export const quotationItemService = new QuotationItemService();
