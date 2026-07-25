import { NotFoundError } from '@/lib/errors';
import { BaseService } from '@/lib/service-base';
import { leadRepository, LeadRepository } from '../repository/lead-repository';
import { leadSchema } from '../schemas';
import type { Lead } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class LeadService extends BaseService<Lead, Lead, Partial<Lead>, LeadRepository> {
  protected entityName = 'Lead';

  constructor() {
    super(leadRepository);
  }

  async list(): Promise<Lead[]> {
    return this.repository.findAll() as Promise<Lead[]>;
  }

  async get(id: string): Promise<Lead> {
    const lead = await this.repository.findById(id);
    if (!lead) throw new NotFoundError('Lead', id);
    return lead;
  }

  async create(data: Record<string, unknown>): Promise<Lead> {
    const number = await this.repository.getNextNumber();
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
    return this.repository.create(parsed);
  }

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    return this.repository.update(id, { ...data, updatedAt: new Date() });
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async restore(id: string): Promise<Lead> {
    return this.repository.restore(id);
  }

  async duplicate(id: string): Promise<Lead> {
    const original = await this.get(id);
    if (!original) throw new NotFoundError('Lead', id);
    const { id: _id, createdAt, updatedAt, deletedAt, deletedBy: _deletedBy, ...data } = original;
    return this.create(data as unknown as Record<string, unknown>);
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    return this.repository.getTotalByStatus(COMPANY_ID);
  }
}

export const leadService = new LeadService();
