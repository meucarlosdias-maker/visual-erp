import { BaseRepository, PaginationInput } from '@/lib/repository-base';
import type { QuotationEvent } from '../types/audit';

const mockEvents: QuotationEvent[] = [];

export class AuditRepository extends BaseRepository<QuotationEvent, QuotationEvent, Partial<QuotationEvent>> {
  async findAll(_params?: PaginationInput): Promise<QuotationEvent[]> {
    return [...mockEvents].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<QuotationEvent | null> {
    return mockEvents.find((e) => e.id === id) ?? null;
  }

  async findMany(filter: Partial<QuotationEvent>): Promise<QuotationEvent[]> {
    return mockEvents.filter((e) =>
      Object.entries(filter).every(([key, value]) => (e as unknown as Record<string, unknown>)[key] === value)
    );
  }

  async create(event: QuotationEvent): Promise<QuotationEvent> {
    mockEvents.push(event);
    return event;
  }

  async update(id: string, data: Partial<QuotationEvent>): Promise<QuotationEvent> {
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

  async restore(id: string): Promise<QuotationEvent> {
    const event = mockEvents.find((e) => e.id === id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async listByQuotationId(quotationId: string): Promise<QuotationEvent[]> {
    return mockEvents
      .filter((e) => e.quotationId === quotationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listByQuotationNumber(quotationNumber: string): Promise<QuotationEvent[]> {
    return mockEvents
      .filter((e) => e.quotationNumber === quotationNumber)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listAll(limit = 100): Promise<QuotationEvent[]> {
    return [...mockEvents]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const auditRepository = new AuditRepository();
