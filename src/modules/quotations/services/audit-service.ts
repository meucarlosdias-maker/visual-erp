import { BaseService } from '@/lib/service-base';
import { auditRepository } from '../repository/audit-repository';
import type { QuotationEvent, QuotationEventType } from '../types/audit';
import { QUOTATION_EVENT_LABELS } from '../types/audit';
import type { AuditRepository } from '../repository/audit-repository';

export class AuditService extends BaseService<QuotationEvent, QuotationEvent, Partial<QuotationEvent>, AuditRepository> {
  protected entityName = 'QuotationEvent';

  constructor() {
    super(auditRepository);
  }

  async listByQuotationId(quotationId: string): Promise<QuotationEvent[]> {
    return this.repository.listByQuotationId(quotationId);
  }

  async listByQuotationNumber(quotationNumber: string): Promise<QuotationEvent[]> {
    return this.repository.listByQuotationNumber(quotationNumber);
  }

  async listAll(limit?: number): Promise<QuotationEvent[]> {
    return this.repository.listAll(limit);
  }

  async register(
    quotationId: string,
    quotationNumber: string,
    eventType: QuotationEventType,
    metadata?: Record<string, unknown> | null,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    const event: QuotationEvent = {
      id: crypto.randomUUID(),
      quotationId,
      quotationNumber,
      eventType,
      userId: userId ?? null,
      description: QUOTATION_EVENT_LABELS[eventType],
      metadata: metadata ?? null,
      createdAt: new Date(),
    };
    return this.repository.create(event);
  }

  async registerCreated(
    quotationId: string,
    quotationNumber: string,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'CREATED', null, userId);
  }

  async registerEdited(
    quotationId: string,
    quotationNumber: string,
    changes: Record<string, unknown>,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'EDITED', { changes }, userId);
  }

  async registerDuplicated(
    quotationId: string,
    quotationNumber: string,
    sourceQuotationId: string,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'DUPLICATED', { sourceQuotationId }, userId);
  }

  async registerSent(
    quotationId: string,
    quotationNumber: string,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'SENT', null, userId);
  }

  async registerApproved(
    quotationId: string,
    quotationNumber: string,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'APPROVED', null, userId);
  }

  async registerRejected(
    quotationId: string,
    quotationNumber: string,
    reason?: string,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'REJECTED', { reason: reason ?? null }, userId);
  }

  async registerCancelled(
    quotationId: string,
    quotationNumber: string,
    reason?: string,
    userId?: string | null,
  ): Promise<QuotationEvent> {
    return this.register(quotationId, quotationNumber, 'CANCELLED', { reason: reason ?? null }, userId);
  }
}

export const auditService = new AuditService();
