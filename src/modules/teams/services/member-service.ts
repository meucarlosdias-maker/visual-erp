import { teamMemberRepository } from '../repository/member-repository';
import { teamMemberSchema } from '../schemas/member-schema';
import type { TeamMember } from '../types';
import type { TeamMemberRepository } from '../repository/member-repository';
import { BaseService } from '@/lib/service-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class TeamMemberService extends BaseService<TeamMember, Record<string, unknown>, Record<string, unknown>, TeamMemberRepository> {
  constructor() {
    super(teamMemberRepository);
  }

  protected entityName = 'Membro';

  async list(): Promise<TeamMember[]> {
    return (this.repository as TeamMemberRepository).findAll();
  }

  async listByTeam(teamId: string): Promise<TeamMember[]> {
    return (this.repository as TeamMemberRepository).findMany({ companyId: COMPANY_ID, teamId } as Partial<TeamMember>);
  }

  async create(data: Record<string, unknown>): Promise<TeamMember> {
    const parsed = teamMemberSchema.omit({ id: true }).parse({ ...data, companyId: COMPANY_ID });
    return (this.repository as TeamMemberRepository).create(parsed as TeamMember);
  }

  async update(id: string, data: Record<string, unknown>): Promise<TeamMember> {
    return (this.repository as TeamMemberRepository).update(id, data);
  }
}

export const teamMemberService = new TeamMemberService();
