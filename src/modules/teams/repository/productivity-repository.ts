import type { TeamProductivity } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockProductivity: TeamProductivity[] = [
  {
    id: 'prod-001', teamId: 'team-001',
    serviceType: 'Impressão Digital', unit: 'M2',
    productionPerHour: 15, installationPerHour: 8,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
  },
  {
    id: 'prod-002', teamId: 'team-001',
    serviceType: 'Adesivamento', unit: 'M2',
    productionPerHour: 20, installationPerHour: 10,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
  },
  {
    id: 'prod-003', teamId: 'team-002',
    serviceType: 'Pintura', unit: 'M2',
    productionPerHour: 12, installationPerHour: 6,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
  },
];

export class TeamProductivityRepository extends BaseRepository<TeamProductivity, TeamProductivity, Partial<TeamProductivity>> {
  async findAll(): Promise<TeamProductivity[]> {
    return mockProductivity.filter((p) => p.companyId === COMPANY_ID);
  }

  async findById(id: string): Promise<TeamProductivity | null> {
    return mockProductivity.find((p) => p.id === id) ?? null;
  }

  async findMany(filter: Partial<TeamProductivity>): Promise<TeamProductivity[]> {
    return mockProductivity.filter((p) =>
      Object.entries(filter).every(([key, value]) => p[key as keyof TeamProductivity] === value)
    );
  }

  async create(data: TeamProductivity): Promise<TeamProductivity> {
    const item: TeamProductivity = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockProductivity.push(item);
    return item;
  }

  async update(id: string, data: Partial<TeamProductivity>): Promise<TeamProductivity> {
    const idx = mockProductivity.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Produtividade não encontrada');
    mockProductivity[idx] = { ...mockProductivity[idx], ...data, updatedAt: new Date() };
    return mockProductivity[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockProductivity.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Produtividade não encontrada');
    mockProductivity.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<TeamProductivity> {
    const idx = mockProductivity.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Produtividade não encontrada');
    return mockProductivity[idx];
  }
}

export const teamProductivityRepository = new TeamProductivityRepository();
