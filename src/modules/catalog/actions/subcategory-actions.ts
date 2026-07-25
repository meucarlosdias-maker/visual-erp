'use server';

import { subcategoryService } from '../services/subcategory-service';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';
const USER_ID = '00000000-0000-0000-0000-000000000000';

export async function listSubcategories(categoryId?: string) {
  return subcategoryService.list(categoryId);
}

export async function getSubcategory(id: string) {
  return subcategoryService.getById(id);
}

export async function createSubcategory(data: Record<string, unknown>) {
  return subcategoryService.create(data);
}

export async function updateSubcategory(id: string, data: Record<string, unknown>) {
  return subcategoryService.update(id, data);
}

export async function deleteSubcategory(id: string) {
  await subcategoryService.delete(id);
}

export async function toggleSubcategoryActive(id: string) {
  return subcategoryService.toggleActive(id);
}
