import type { TeamMember } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockMembers: TeamMember[] = [
  {
    id: 'mem-001', teamId: 'team-001',
    name: 'Carlos Silva', role: 'INSTALLER',
    hourCost: 35.00, active: true,
    companyId: COMPANY_ID,
  },
  {
    id: 'mem-002', teamId: 'team-001',
    name: 'João Santos', role: 'ASSISTANT',
    hourCost: 22.00, active: true,
    companyId: COMPANY_ID,
  },
  {
    id: 'mem-003', teamId: 'team-002',
    name: 'Maria Oliveira', role: 'PAINTER',
    hourCost: 45.00, active: true,
    companyId: COMPANY_ID,
  },
  {
    id: 'mem-004', teamId: '',
    name: 'Pedro Costa', role: 'CUSTOM',
    hourCost: 18.00, active: true,
    companyId: COMPANY_ID,
  },
];

export class TeamMemberRepository extends BaseRepository<TeamMember, TeamMember, Partial<TeamMember>> {
  async findAll(): Promise<TeamMember[]> {
    return [...mockMembers]
      .filter((m) => m.companyId === COMPANY_ID)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<TeamMember | null> {
    return mockMembers.find((m) => m.id === id) ?? null;
  }

  async findMany(filter: Partial<TeamMember>): Promise<TeamMember[]> {
    return mockMembers.filter((m) =>
      Object.entries(filter).every(([key, value]) => m[key as keyof TeamMember] === value)
    );
  }

  async create(data: TeamMember): Promise<TeamMember> {
    const item: TeamMember = { ...data, id: crypto.randomUUID() };
    mockMembers.push(item);
    return item;
  }

  async update(id: string, data: Partial<TeamMember>): Promise<TeamMember> {
    const idx = mockMembers.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Membro não encontrado');
    mockMembers[idx] = { ...mockMembers[idx], ...data };
    return mockMembers[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockMembers.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Membro não encontrado');
    mockMembers.splice(idx, 1);
    return true;
  }

  async restore(id: string): Promise<TeamMember> {
    const idx = mockMembers.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Membro não encontrado');
    return mockMembers[idx];
  }
}

export const teamMemberRepository = new TeamMemberRepository();
