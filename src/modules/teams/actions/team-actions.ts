'use server';

import { teamService } from '../services/team-service';

export async function listTeams() {
  return teamService.list();
}

export async function getTeam(id: string) {
  return teamService.get(id);
}

export async function createTeam(data: Record<string, unknown>) {
  return teamService.create(data);
}

export async function updateTeam(id: string, data: Record<string, unknown>) {
  return teamService.update(id, data);
}

export async function deleteTeam(id: string) {
  return teamService.delete(id);
}

export async function toggleTeamActive(id: string) {
  return teamService.toggleActive(id);
}
