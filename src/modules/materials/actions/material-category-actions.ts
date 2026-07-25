'use server';

import { materialCategoryService } from '../services/material-category-service';

export async function listMaterialCategories() {
  return materialCategoryService.list();
}

export async function getMaterialCategory(id: string) {
  return materialCategoryService.get(id);
}

export async function createMaterialCategory(data: Record<string, unknown>) {
  return materialCategoryService.create(data);
}

export async function updateMaterialCategory(id: string, data: Record<string, unknown>) {
  return materialCategoryService.update(id, data);
}

export async function toggleMaterialCategoryActive(id: string) {
  return materialCategoryService.toggleActive(id);
}

export async function removeMaterialCategory(id: string) {
  return materialCategoryService.delete(id);
}
