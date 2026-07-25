import { BaseService } from '@/lib/service-base';
import { workOrderEventRepository } from '../repository/work-order-event-repository';
import { workOrderEventSchema } from '../schemas';
import type { WorkOrderEvent } from '../types';
import type { WorkOrderEventRepository } from '../repository/work-order-event-repository';

export class TimelineService extends BaseService<WorkOrderEvent, Record<string, unknown>, Partial<WorkOrderEvent>, WorkOrderEventRepository> {
  protected entityName = 'WorkOrderEvent';

  constructor() {
    super(workOrderEventRepository);
  }

  async listByWorkOrderId(workOrderId: string): Promise<WorkOrderEvent[]> {
    return this.repository.listByWorkOrderId(workOrderId);
  }

  async create(data: Record<string, unknown>): Promise<WorkOrderEvent> {
    const parsed = workOrderEventSchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    });
    return this.repository.create(parsed);
  }
}

export const timelineService = new TimelineService();
