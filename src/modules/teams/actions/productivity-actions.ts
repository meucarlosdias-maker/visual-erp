'use server';

import { teamProductivityService } from '../services/productivity-service';

export async function listProductivity(teamId: string) {
  return teamProductivityService.listByTeam(teamId);
}

export async function getProductivity(id: string) {
  return teamProductivityService.get(id);
}

export async function createProductivity(data: Record<string, unknown>) {
  return teamProductivityService.create(data);
}

export async function updateProductivity(id: string, data: Record<string, unknown>) {
  return teamProductivityService.update(id, data);
}

export async function deleteProductivity(id: string) {
  return teamProductivityService.delete(id);
}
