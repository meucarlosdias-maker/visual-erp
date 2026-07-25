import type { Visit } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const mockVisits: Visit[] = [
  {
    id: 'vis-001', leadId: 'lead-002', clientId: null,
    sellerId: 'user-001', status: 'SCHEDULED',
    scheduledDate: new Date('2026-07-25T09:00:00'),
    startDate: null, endDate: null,
    address: 'Av. das Américas, 500', city: 'Rio de Janeiro', state: 'RJ',
    zipCode: '22000-000', contactName: 'Ana Oliveira', contactPhone: '(21) 98888-0002',
    notes: 'Levar amostras de lona oléfina',
    measurements: [], collectedInfo: '',
    createdAt: new Date('2026-07-19'), updatedAt: new Date('2026-07-19'),
  },
  {
    id: 'vis-002', leadId: 'lead-001', clientId: null,
    sellerId: 'user-001', status: 'SCHEDULED',
    scheduledDate: new Date('2026-07-28T14:00:00'),
    startDate: null, endDate: null,
    address: 'Rua Augusta, 1500', city: 'São Paulo', state: 'SP',
    zipCode: '01304-001', contactName: 'Carlos Silva', contactPhone: '(11) 99999-0001',
    notes: 'Visita técnica para medição',
    measurements: [], collectedInfo: '',
    createdAt: new Date('2026-07-20'), updatedAt: new Date('2026-07-20'),
  },
];

export class VisitRepository extends BaseRepository<Visit, Visit, Partial<Visit>> {
  async findAll(): Promise<Visit[]> {
    return [...mockVisits].sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  }

  async findById(id: string): Promise<Visit | null> {
    return mockVisits.find((v) => v.id === id) ?? null;
  }

  async findMany(filter: Partial<Visit>): Promise<Visit[]> {
    return mockVisits.filter((v) =>
      Object.entries(filter).every(([key, value]) =>
        (v as Record<string, unknown>)[key] === value
      )
    );
  }

  async create(data: Visit): Promise<Visit> {
    mockVisits.push(data);
    return data;
  }

  async update(id: string, data: Partial<Visit>): Promise<Visit> {
    const idx = mockVisits.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error('Visita não encontrada');
    mockVisits[idx] = { ...mockVisits[idx], ...data, updatedAt: new Date() };
    return mockVisits[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockVisits.findIndex((v) => v.id === id);
    if (idx !== -1) {
      mockVisits.splice(idx, 1);
      return true;
    }
    return false;
  }

  async restore(id: string): Promise<Visit> {
    const entity = await this.findById(id);
    if (!entity) throw new Error('Visita não encontrada');
    return entity;
  }

  async listByLeadId(leadId: string): Promise<Visit[]> {
    return mockVisits
      .filter((v) => v.leadId === leadId)
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
  }
}

export const visitRepository = new VisitRepository();
