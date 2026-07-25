import { leadRepository } from '../repository/lead-repository';
import { leadActivityRepository } from '../repository/lead-activity-repository';
import { visitRepository } from '../repository/visit-repository';
import { visitAttachmentRepository } from '../repository/visit-attachment-repository';
import { leadSchema, leadActivitySchema, visitSchema, visitAttachmentSchema } from '../schemas';
import type { Lead, LeadActivity, Visit, VisitAttachment } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class CrmService {
  async listLeads(): Promise<Lead[]> {
    return leadRepository.findAll() as Promise<Lead[]>;
  }

  async getLead(id: string): Promise<Lead | null> {
    return leadRepository.findById(id);
  }

  async createLead(data: Record<string, unknown>): Promise<Lead> {
    const number = await leadRepository.getNextNumber();
    const now = new Date();
    const parsed = leadSchema.parse({
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      number,
      ...data,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: (data.createdBy as string) || '',
      updatedBy: (data.updatedBy as string) || '',
      deletedBy: null,
    });
    return leadRepository.create(parsed);
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    return leadRepository.update(id, { ...data, updatedAt: new Date() });
  }

  async deleteLead(id: string): Promise<boolean> {
    return leadRepository.delete(id);
  }

  async getLeadStatusCounts(): Promise<Record<string, number>> {
    return leadRepository.getTotalByStatus(COMPANY_ID);
  }

  async listActivities(leadId: string): Promise<LeadActivity[]> {
    return leadActivityRepository.listByLeadId(leadId);
  }

  async createActivity(data: Record<string, unknown>): Promise<LeadActivity> {
    const parsed = leadActivitySchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
    });
    return leadActivityRepository.create(parsed);
  }

  async updateActivity(id: string, data: Partial<LeadActivity>): Promise<LeadActivity> {
    return leadActivityRepository.update(id, data);
  }

  async deleteActivity(id: string): Promise<boolean> {
    return leadActivityRepository.delete(id);
  }

  async listVisits(leadId?: string): Promise<Visit[]> {
    if (leadId) return visitRepository.listByLeadId(leadId);
    return visitRepository.findAll() as Promise<Visit[]>;
  }

  async getVisit(id: string): Promise<Visit | null> {
    return visitRepository.findById(id);
  }

  async createVisit(data: Record<string, unknown>): Promise<Visit> {
    const parsed = visitSchema.parse({
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return visitRepository.create(parsed);
  }

  async updateVisit(id: string, data: Partial<Visit>): Promise<Visit> {
    return visitRepository.update(id, data);
  }

  async deleteVisit(id: string): Promise<boolean> {
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

export const crmService = new CrmService();
