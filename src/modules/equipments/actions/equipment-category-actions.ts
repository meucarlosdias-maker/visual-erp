'use server';

import { equipmentCategoryService } from '../services/equipment-category-service';

export async function listEquipmentCategories() {
  return equipmentCategoryService.list();
}

export async function getEquipmentCategory(id: string) {
  return equipmentCategoryService.get(id);
}

export async function createEquipmentCategory(data: Record<string, unknown>) {
  return equipmentCategoryService.create(data);
}

export async function updateEquipmentCategory(id: string, data: Record<string, unknown>) {
  return equipmentCategoryService.update(id, data);
}

export async function deleteEquipmentCategory(id: string) {
  return equipmentCategoryService.delete(id);
}

export async function toggleEquipmentCategoryActive(id: string) {
  return equipmentCategoryService.toggleActive(id);
}
