'use server';

import { categoryService } from '../services/category-service';

export async function listCategories() {
  return categoryService.list();
}

export async function getCategory(id: string) {
  return categoryService.getById(id);
}

export async function createCategory(data: Record<string, unknown>) {
  return categoryService.create(data);
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  return categoryService.update(id, data);
}

export async function toggleCategoryActive(id: string) {
  return categoryService.toggleActive(id);
}

export async function removeCategory(id: string) {
  return categoryService.remove(id);
}
