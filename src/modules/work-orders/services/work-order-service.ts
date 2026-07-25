import { BaseService } from '@/lib/service-base';
import { workOrderRepository } from '../repository/work-order-repository';
import { workOrderItemRepository } from '../repository/work-order-item-repository';
import { workOrderAttachmentRepository } from '../repository/work-order-attachment-repository';
import { workOrderEventRepository } from '../repository/work-order-event-repository';
import { workOrderSchema, workOrderItemSchema, workOrderAttachmentSchema, workOrderEventSchema } from '../schemas';
import type { WorkOrder, WorkOrderItem, WorkOrderAttachment, WorkOrderEvent } from '../types';
import type { WorkOrderRepository } from '../repository/work-order-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class WorkOrderService extends BaseService<WorkOrder, Record<string, unknown>, Partial<WorkOrder>, WorkOrderRepository> {
  protected entityName = 'WorkOrder';

  constructor() {
    super(workOrderRepository);
  }

  async create(data: Record<string, unknown>): Promise<WorkOrder> {
    const number = await this.repository.getNextNumber();
    const now = new Date();
    const parsed = workOrderSchema.parse({
      companyId: COMPANY_ID,
      number,
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: (data.createdBy as string) || '',
      updatedBy: (data.updatedBy as string) || '',
      deletedBy: null,
    });

    const created = await this.repository.create(parsed);
    await workOrderEventRepository.create({
      workOrderId: created.id,
      type: 'CREATED',
      id: crypto.randomUUID(),
      description: 'OS criada',
      userId: parsed.createdBy,
      createdAt: now,
    });
    return created;
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    return this.repository.getStatusCounts(COMPANY_ID);
  }

  async listItems(workOrderId: string): Promise<WorkOrderItem[]> {
    return workOrderItemRepository.listByWorkOrderId(workOrderId);
  }

  async createItem(data: Record<string, unknown>): Promise<WorkOrderItem> {
    const parsed = workOrderItemSchema.parse({
      ...data,
      id: crypto.randomUUID(),
    });
    return workOrderItemRepository.create(parsed);
  }

  async updateItem(id: string, data: Partial<WorkOrderItem>): Promise<WorkOrderItem> {
    return workOrderItemRepository.update(id, data);
  }

  async deleteItem(id: string): Promise<boolean> {
    return workOrderItemRepository.delete(id);
  }

  async listEvents(workOrderId: string): Promise<WorkOrderEvent[]> {
    return workOrderEventRepository.listByWorkOrderId(workOrderId);
  }

  async createEvent(data: Record<string, unknown>): Promise<WorkOrderEvent> {
    const parsed = workOrderEventSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
    return workOrderEventRepository.create(parsed);
  }

  async listAttachments(workOrderId: string): Promise<WorkOrderAttachment[]> {
    return workOrderAttachmentRepository.listByWorkOrderId(workOrderId);
  }

  async createAttachment(data: Record<string, unknown>): Promise<WorkOrderAttachment> {
    const parsed = workOrderAttachmentSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
    return workOrderAttachmentRepository.create(parsed);
  }

  async deleteAttachment(id: string): Promise<boolean> {
    return workOrderAttachmentRepository.delete(id);
  }
}

export const workOrderService = new WorkOrderService();
