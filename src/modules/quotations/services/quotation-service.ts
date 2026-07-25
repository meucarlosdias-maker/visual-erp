import { BaseService } from '@/lib/service-base';
import { NotFoundError } from '@/lib/errors';
import { quotationRepository } from '../repository/quotation-repository';
import { quotationCreateSchema } from '../schemas/quotation-schema';
import { auditService } from './audit-service';
import { projectService } from '@/modules/projects/services/project-service';
import type { Quotation, QuotationItem } from '../types';
import type { QuotationRepository } from '../repository/quotation-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

function computeTotal(subtotal: number, discount: number, discountType: string | null): number {
  if (discountType === 'PERCENTAGE') return subtotal * (1 - discount / 100);
  if (discountType === 'VALUE') return Math.max(0, subtotal - discount);
  return subtotal;
}

export class QuotationService extends BaseService<Quotation, Record<string, unknown>, Record<string, unknown>, QuotationRepository> {
  protected entityName = 'Quotation';

  constructor() {
    super(quotationRepository);
  }

  async listVersions(number: string): Promise<Quotation[]> {
    return this.repository.listVersions(number);
  }

  async getLatestByNumber(number: string): Promise<Quotation | null> {
    return this.repository.getLatestByNumber(number);
  }

  async create(data: Record<string, unknown>): Promise<Quotation> {
    const parsed = quotationCreateSchema.parse(data);
    const number = await this.repository.getNextNumber(COMPANY_ID);

    const items: QuotationItem[] = (parsed.items ?? []).map((item, idx) => ({
      id: crypto.randomUUID(),
      quotationId: '',
      serviceId: item.serviceId ?? null,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      pricingSnapshot: item.pricingSnapshot ?? null,
      sortOrder: item.sortOrder ?? idx,
    }));

    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
    const discount = parsed.discount ?? 0;
    const discountType = parsed.discountType ?? null;
    const total = computeTotal(subtotal, discount, discountType);

    const now = new Date();
    const quotationId = crypto.randomUUID();

    const quotation: Quotation = {
      id: quotationId,
      companyId: COMPANY_ID,
      clientId: parsed.clientId ?? null,
      number,
      version: 1,
      status: 'DRAFT',
      title: parsed.title,
      description: parsed.description ?? '',
      validUntil: parsed.validUntil ? new Date(parsed.validUntil) : null,
      subtotal,
      discount,
      discountType,
      total,
      notes: parsed.notes ?? '',
      internalNotes: parsed.internalNotes ?? '',
      items: items.map((item) => ({ ...item, quotationId })),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: '',
      updatedBy: null,
      deletedBy: null,
    };

    const created = await this.repository.create(quotation);
    await auditService.registerCreated(quotationId, number);
    return created;
  }

  async duplicate(id: string): Promise<Quotation> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new Error('Orçamento não encontrado');

    const number = await this.repository.getNextNumber(COMPANY_ID);
    const now = new Date();
    const quotationId = crypto.randomUUID();

    const quotation: Quotation = {
      ...existing,
      id: quotationId,
      number,
      version: 1,
      status: 'DRAFT',
      title: `${existing.title} (cópia)`,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      items: existing.items.map((item, idx) => ({
        ...item,
        id: crypto.randomUUID(),
        quotationId,
        sortOrder: idx,
      })),
    };

    const created = await this.repository.create(quotation);
    await auditService.registerDuplicated(quotationId, number, id);
    return created;
  }

  async update(id: string, data: Record<string, unknown>): Promise<Quotation> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError(this.entityName, id);

    const isLocked = existing.status === 'APPROVED' || existing.status === 'CANCELLED' || existing.status === 'EXPIRED';

    const itemsRaw = data.items as Array<Record<string, unknown>> | undefined;
    const items: QuotationItem[] = (itemsRaw ?? existing.items).map((item: Record<string, unknown>, idx: number) => ({
      id: (item.id as string) ?? crypto.randomUUID(),
      quotationId: '',
      serviceId: (item.serviceId as string) ?? null,
      description: (item.description as string) ?? '',
      quantity: Number(item.quantity) ?? 1,
      unit: (item.unit as string) ?? 'UN',
      unitPrice: Number(item.unitPrice) ?? 0,
      totalPrice: (Number(item.quantity) ?? 1) * (Number(item.unitPrice) ?? 0),
      pricingSnapshot: (item.pricingSnapshot as Record<string, unknown>) ?? null,
      sortOrder: idx,
    }));

    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
    const discount = data.discount !== undefined ? Number(data.discount) : existing.discount;
    const discountType = data.discountType !== undefined ? (data.discountType as string | null) : existing.discountType;
    const total = computeTotal(subtotal, discount, discountType);

    const patch: Partial<Quotation> = {
      title: (data.title as string) ?? existing.title,
      description: (data.description as string) ?? existing.description,
      clientId: data.clientId !== undefined ? (data.clientId as string | null) : existing.clientId,
      validUntil: data.validUntil ? new Date(data.validUntil as string) : data.validUntil === null ? null : existing.validUntil,
      subtotal,
      discount,
      discountType: discountType as Quotation['discountType'],
      total,
      notes: (data.notes as string) ?? existing.notes,
      internalNotes: (data.internalNotes as string) ?? existing.internalNotes,
      items,
      updatedAt: new Date(),
    };

    if (isLocked) {
      const updated = await this.repository.createVersion(id, patch);
      await auditService.registerEdited(updated.id, updated.number, { version: updated.version, ...patch });
      return updated;
    }

    patch.items = items.map((item) => ({ ...item, quotationId: id }));
    const updated = await this.repository.update(id, patch);
    await auditService.registerEdited(id, updated.number, {});
    return updated;
  }

  async updateStatus(id: string, status: string): Promise<Quotation> {
    const quotation = await this.repository.findById(id);
    if (!quotation) throw new Error('Orçamento não encontrado');

    const updated = await this.repository.update(id, { status: status as Quotation['status'] });

    if (status === 'SENT') {
      await auditService.registerSent(id, quotation.number);
    } else if (status === 'APPROVED') {
      await auditService.registerApproved(id, quotation.number);
      await projectService.createFromQuotation(id, quotation.clientId, quotation.title);
    } else if (status === 'REJECTED') {
      await auditService.registerRejected(id, quotation.number);
    } else if (status === 'CANCELLED') {
      await auditService.registerCancelled(id, quotation.number);
    }

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const quotation = await this.repository.findById(id);
    if (!quotation) throw new NotFoundError(this.entityName, id);

    const result = await this.repository.delete(id);
    await auditService.registerCancelled(id, quotation.number, 'Removido');
    return result;
  }
}

export const quotationService = new QuotationService();
