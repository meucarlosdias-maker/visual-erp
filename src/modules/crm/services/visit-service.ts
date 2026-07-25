import { BaseService } from '@/lib/service-base';
import { NotFoundError } from '@/lib/errors';
import { visitRepository, VisitRepository } from '../repository/visit-repository';
import { visitAttachmentRepository } from '../repository/visit-attachment-repository';
import { visitSchema, visitAttachmentSchema } from '../schemas';
import type { Visit, VisitAttachment } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class VisitService extends BaseService<Visit, Visit, Partial<Visit>, VisitRepository> {
  protected entityName = 'Visit';

  constructor() {
    super(visitRepository);
  }

  async listByLead(leadId?: string): Promise<Visit[]> {
    if (leadId) return visitRepository.listByLeadId(leadId);
    return visitRepository.findAll() as Promise<Visit[]>;
  }

  async get(id: string): Promise<Visit> {
    const visit = await visitRepository.findById(id);
    if (!visit) throw new NotFoundError('Visit', id);
    return visit;
  }

  async create(data: Record<string, unknown>): Promise<Visit> {
    const parsed = visitSchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return visitRepository.create(parsed);
  }

  async update(id: string, data: Partial<Visit>): Promise<Visit> {
    return visitRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return visitRepository.delete(id);
  }

  async listAttachments(visitId: string): Promise<VisitAttachment[]> {
    return visitAttachmentRepository.listByVisitId(visitId);
  }

  async createAttachment(data: Record<string, unknown>): Promise<VisitAttachment> {
    const parsed = visitAttachmentSchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    });
    return visitAttachmentRepository.create(parsed);
  }

  async deleteAttachment(id: string): Promise<boolean> {
    return visitAttachmentRepository.delete(id);
  }
}

export const visitService = new VisitService();
