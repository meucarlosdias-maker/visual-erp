'use server';

import { materialService } from '../services/material-service';

export async function listMaterials() {
  return materialService.list();
}

export async function getMaterial(id: string) {
  return materialService.get(id);
}

export async function createMaterial(data: Record<string, unknown>) {
  return materialService.create(data);
}

export async function updateMaterial(id: string, data: Record<string, unknown>) {
  return materialService.update(id, data);
}

export async function deleteMaterial(id: string) {
  await materialService.delete(id);
}

export async function toggleMaterialActive(id: string) {
  return materialService.toggleActive(id);
}
