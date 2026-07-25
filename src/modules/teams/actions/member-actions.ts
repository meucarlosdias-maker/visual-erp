'use server';

import { teamMemberService } from '../services/member-service';

export async function listMembers(teamId?: string) {
  return teamId ? teamMemberService.listByTeam(teamId) : teamMemberService.list();
}

export async function getMember(id: string) {
  return teamMemberService.get(id);
}

export async function createMember(data: Record<string, unknown>) {
  return teamMemberService.create(data);
}

export async function updateMember(id: string, data: Record<string, unknown>) {
  return teamMemberService.update(id, data);
}

export async function deleteMember(id: string) {
  return teamMemberService.delete(id);
}
