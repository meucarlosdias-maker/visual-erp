import { subcategoryRepository } from '../repository/subcategory-repository';
import { subcategoryFormSchema } from '../schemas/subcategory-schema';
import type { ServiceSubcategory } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';
const USER_ID = '00000000-0000-0000-0000-000000000000';

export class SubcategoryService {
  async list(categoryId?: string): Promise<ServiceSubcategory[]> {
    return subcategoryRepository.list(COMPANY_ID, categoryId);
  }

  async getById(id: string): Promise<ServiceSubcategory | null> {
    return subcategoryRepository.getById(id);
  }

  async create(data: Record<string, unknown>): Promise<ServiceSubcategory> {
    const parsed = subcategoryFormSchema.parse(data);
    const now = new Date();
    return subcategoryRepository.create({
      id: crypto.randomUUID(),
      ...parsed,
      companyId: COMPANY_ID,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: USER_ID,
      updatedBy: USER_ID,
      deletedBy: null,
    });
  }

  async update(id: string, data: Record<string, unknown>): Promise<ServiceSubcategory> {
    return subcategoryRepository.update(id, { ...data, updatedBy: USER_ID });
  }

  async delete(id: string): Promise<void> {
    await subcategoryRepository.softDelete(id);
  }

  async toggleActive(id: string): Promise<ServiceSubcategory> {
    return subcategoryRepository.toggleActive(id);
  }
}

export const subcategoryService = new SubcategoryService();
