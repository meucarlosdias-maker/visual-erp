import { teamRepository } from '../repository/team-repository';
import { teamMemberRepository } from '../repository/member-repository';
import { teamProductivityRepository } from '../repository/productivity-repository';
import { teamSchema } from '../schemas/team-schema';
import type { Team, TeamWithRelations } from '../types';
import type { TeamRepository } from '../repository/team-repository';
import type { TeamMember } from '../types';
import type { TeamProductivity } from '../types';
import { BaseService } from '@/lib/service-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class TeamService extends BaseService<Team, Record<string, unknown>, Record<string, unknown>, TeamRepository> {
  constructor() {
    super(teamRepository);
  }

  protected entityName = 'Equipe';

  async list(): Promise<Team[]> {
    return (this.repository as TeamRepository).findAll();
  }

  async get(id: string): Promise<TeamWithRelations> {
    const team = await (this.repository as TeamRepository).findById(id);
    if (!team) throw new Error('Equipe não encontrada');
    const [members, productivity] = await Promise.all([
      teamMemberRepository.findMany({ companyId: COMPANY_ID, teamId: id } as Partial<TeamMember>),
      teamProductivityRepository.findMany({ companyId: COMPANY_ID, teamId: id } as Partial<TeamProductivity>),
    ]);
    return { ...team, members, productivity };
  }

  async create(data: Record<string, unknown>): Promise<Team> {
    const parsed = teamSchema.omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true, createdBy: true, updatedBy: true, deletedBy: true }).parse({ ...data, companyId: COMPANY_ID });
    return (this.repository as TeamRepository).create(parsed as Team);
  }

  async update(id: string, data: Record<string, unknown>): Promise<Team> {
    return (this.repository as TeamRepository).update(id, data);
  }

  async toggleActive(id: string): Promise<Team> {
    return (this.repository as TeamRepository).toggleActive(id);
  }
}

export const teamService = new TeamService();
