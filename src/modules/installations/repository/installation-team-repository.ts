import type { InstallationTeam } from '../types';

const mockTeams: InstallationTeam[] = [
  { id: 'it-001', installationId: 'inst-001', teamId: 'team-instalacao', leaderId: null, estimatedHours: 8, actualHours: 6 },
];

export class InstallationTeamRepository {
  async listByInstallationId(installationId: string): Promise<InstallationTeam[]> {
    return mockTeams.filter((t) => t.installationId === installationId);
  }

  async getById(id: string): Promise<InstallationTeam | null> {
    return mockTeams.find((t) => t.id === id) ?? null;
  }

  async create(data: InstallationTeam): Promise<InstallationTeam> {
    mockTeams.push(data);
    return data;
  }

  async update(id: string, data: Partial<InstallationTeam>): Promise<InstallationTeam> {
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Registro não encontrado');
    mockTeams[idx] = { ...mockTeams[idx], ...data };
    return mockTeams[idx];
  }

  async delete(id: string): Promise<void> {
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx !== -1) mockTeams.splice(idx, 1);
  }
}

export const installationTeamRepository = new InstallationTeamRepository();
