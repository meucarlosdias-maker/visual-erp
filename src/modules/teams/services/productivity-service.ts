import { teamProductivityRepository } from '../repository/productivity-repository';
import { teamProductivitySchema } from '../schemas/productivity-schema';
import type { TeamProductivity } from '../types';
import type { TeamProductivityRepository } from '../repository/productivity-repository';
import { BaseService } from '@/lib/service-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class TeamProductivityService extends BaseService<TeamProductivity, Record<string, unknown>, Record<string, unknown>, TeamProductivityRepository> {
  constructor() {
    super(teamProductivityRepository);
  }

  protected entityName = 'Produtividade';

  async list(): Promise<TeamProductivity[]> {
    return (this.repository as TeamProductivityRepository).findAll();
  }

  async listByTeam(teamId: string): Promise<TeamProductivity[]> {
    return (this.repository as TeamProductivityRepository).findMany({ companyId: COMPANY_ID, teamId } as Partial<TeamProductivity>);
  }

  async create(data: Record<string, unknown>): Promise<TeamProductivity> {
    const parsed = teamProductivitySchema.omit({ id: true, createdAt: true, updatedAt: true }).parse({ ...data, companyId: COMPANY_ID });
    return (this.repository as TeamProductivityRepository).create(parsed as TeamProductivity);
  }

  async update(id: string, data: Record<string, unknown>): Promise<TeamProductivity> {
    return (this.repository as TeamProductivityRepository).update(id, data);
  }
}

export const teamProductivityService = new TeamProductivityService();
