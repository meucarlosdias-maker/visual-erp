import { BaseService } from '@/lib/service-base';
import { workOrderAttachmentRepository } from '../repository/work-order-attachment-repository';
import { workOrderAttachmentSchema } from '../schemas';
import type { WorkOrderAttachment } from '../types';
import type { WorkOrderAttachmentRepository } from '../repository/work-order-attachment-repository';

export const ATTACHMENT_CATEGORIES = [
  'Fotos da Visita',
  'Arte',
  'Vetores',
  'PDF',
  'Produção',
  'Instalação',
  'Outros',
] as const;

export class AttachmentService extends BaseService<WorkOrderAttachment, Record<string, unknown>, Partial<WorkOrderAttachment>, WorkOrderAttachmentRepository> {
  protected entityName = 'WorkOrderAttachment';

  constructor() {
    super(workOrderAttachmentRepository);
  }

  async listByWorkOrderId(workOrderId: string): Promise<WorkOrderAttachment[]> {
    return this.repository.listByWorkOrderId(workOrderId);
  }

  async create(data: Record<string, unknown>): Promise<WorkOrderAttachment> {
    const parsed = workOrderAttachmentSchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    });
    return this.repository.create(parsed);
  }
}

export const attachmentService = new AttachmentService();
