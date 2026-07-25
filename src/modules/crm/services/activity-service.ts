import { BaseService } from '@/lib/service-base';
import { leadActivityRepository, LeadActivityRepository } from '../repository/lead-activity-repository';
import { leadActivitySchema } from '../schemas';
import type { LeadActivity } from '../types';

export class ActivityService extends BaseService<LeadActivity, LeadActivity, Partial<LeadActivity>, LeadActivityRepository> {
  protected entityName = 'LeadActivity';

  constructor() {
    super(leadActivityRepository);
  }

  async listByLeadId(leadId: string): Promise<LeadActivity[]> {
    return leadActivityRepository.listByLeadId(leadId);
  }

  async create(data: Record<string, unknown>): Promise<LeadActivity> {
    const parsed = leadActivitySchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    });
    return leadActivityRepository.create(parsed);
  }

  async update(id: string, data: Partial<LeadActivity>): Promise<LeadActivity> {
    return leadActivityRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return leadActivityRepository.delete(id);
  }
}

export const activityService = new ActivityService();
