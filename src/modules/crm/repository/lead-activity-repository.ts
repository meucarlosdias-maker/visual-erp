import type { LeadActivity } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const mockActivities: LeadActivity[] = [
  {
    id: 'act-001', leadId: 'lead-001', type: 'CALL',
    description: 'Primeiro contato telefônico. Cliente interessado.',
    scheduledAt: new Date('2026-07-20T10:00:00'),
    completedAt: new Date('2026-07-20T10:15:00'),
    userId: 'user-001',
    createdAt: new Date('2026-07-20'),
  },
  {
    id: 'act-002', leadId: 'lead-001', type: 'EMAIL',
    description: 'Envio de catálogo de produtos via e-mail.',
    scheduledAt: null,
    completedAt: new Date('2026-07-20T14:00:00'),
    userId: 'user-001',
    createdAt: new Date('2026-07-20'),
  },
  {
    id: 'act-003', leadId: 'lead-002', type: 'CALL',
    description: 'Retorno telefônico. Cliente quer agendar visita.',
    scheduledAt: new Date('2026-07-19T09:00:00'),
    completedAt: new Date('2026-07-19T09:20:00'),
    userId: 'user-001',
    createdAt: new Date('2026-07-19'),
  },
  {
    id: 'act-004', leadId: 'lead-004', type: 'MEETING',
    description: 'Reunião presencial para apresentação de proposta.',
    scheduledAt: new Date('2026-07-12T15:00:00'),
    completedAt: new Date('2026-07-12T16:30:00'),
    userId: 'user-001',
    createdAt: new Date('2026-07-12'),
  },
];

export class LeadActivityRepository extends BaseRepository<LeadActivity, LeadActivity, Partial<LeadActivity>> {
  async findAll(): Promise<LeadActivity[]> {
    return [...mockActivities].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<LeadActivity | null> {
    return mockActivities.find((a) => a.id === id) ?? null;
  }

  async findMany(filter: Partial<LeadActivity>): Promise<LeadActivity[]> {
    return mockActivities.filter((a) =>
      Object.entries(filter).every(([key, value]) =>
        (a as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(data: LeadActivity): Promise<LeadActivity> {
    mockActivities.push(data);
    return data;
  }

  async update(id: string, data: Partial<LeadActivity>): Promise<LeadActivity> {
    const idx = mockActivities.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Atividade não encontrada');
    mockActivities[idx] = { ...mockActivities[idx], ...data };
    return mockActivities[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockActivities.findIndex((a) => a.id === id);
    if (idx !== -1) {
      mockActivities.splice(idx, 1);
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<LeadActivity> {
    const entity = await this.findById(id);
    if (!entity) throw new Error('Atividade não encontrada');
    return entity;
  }

  async listByLeadId(leadId: string): Promise<LeadActivity[]> {
    return mockActivities
      .filter((a) => a.leadId === leadId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const leadActivityRepository = new LeadActivityRepository();
