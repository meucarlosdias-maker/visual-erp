import type { Team } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockTeams: Team[] = [
  {
    id: 'team-001', code: 'EQP-001', name: 'Instalação Padrão',
    description: 'Equipe padrão para instalações de fachada',
    hourCost: 85.00, dailyCost: 560.00, defaultMargin: 30, active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'team-002', code: 'EQP-002', name: 'Pintura Especializada',
    description: 'Equipe especializada em pintura de alto padrão',
    hourCost: 120.00, dailyCost: 800.00, defaultMargin: 40, active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'team-003', code: 'EQP-003', name: 'Manutenção Rápida',
    description: 'Equipe para pequenos reparos e manutenção',
    hourCost: 65.00, dailyCost: 420.00, defaultMargin: 25, active: false,
    companyId: COMPANY_ID,
    createdAt: new Date('2025-02-01'), updatedAt: new Date('2025-05-15'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class TeamRepository extends BaseRepository<Team, Team, Partial<Team>> {
  async findAll(): Promise<Team[]> {
    return mockTeams
      .filter((t) => t.companyId === COMPANY_ID && !t.deletedAt)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Team | null> {
    return mockTeams.find((t) => t.id === id && !t.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Team>): Promise<Team[]> {
    return mockTeams.filter((t) =>
      Object.entries(filter).every(([key, value]) => t[key as keyof Team] === value)
    );
  }

  async create(data: Team): Promise<Team> {
    const item: Team = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockTeams.push(item);
    return item;
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Equipe não encontrada');
    mockTeams[idx] = { ...mockTeams[idx], ...data, updatedAt: new Date() };
    return mockTeams[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Equipe não encontrada');
    mockTeams[idx] = { ...mockTeams[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<Team> {
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Equipe não encontrada');
    mockTeams[idx] = { ...mockTeams[idx], deletedAt: null, updatedAt: new Date() };
    return mockTeams[idx];
  }

  async toggleActive(id: string): Promise<Team> {
    const item = await this.findById(id);
    if (!item) throw new Error('Equipe não encontrada');
    return this.update(id, { active: !item.active });
  }
}

export const teamRepository = new TeamRepository();
