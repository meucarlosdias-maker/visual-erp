import type { ServiceCategory } from '../types';
import { categoryRepository } from '../repository/category-repository';
import { categoryFormSchema } from '../schemas/category-schema';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class CategoryService {
  async list(): Promise<ServiceCategory[]> {
    return categoryRepository.list(COMPANY_ID);
  }

  async getById(id: string): Promise<ServiceCategory | null> {
    return categoryRepository.getById(id);
  }

  async create(data: Record<string, unknown>): Promise<ServiceCategory> {
    const parsed = categoryFormSchema.parse(data);
    return categoryRepository.create({
      ...parsed,
      companyId: COMPANY_ID,
    } as ServiceCategory);
  }

  async update(id: string, data: Record<string, unknown>): Promise<ServiceCategory> {
    const parsed = categoryFormSchema.partial().parse(data);
    return categoryRepository.update(id, parsed);
  }

  async toggleActive(id: string): Promise<ServiceCategory> {
    return categoryRepository.toggleActive(id);
  }

  async remove(id: string): Promise<void> {
    return categoryRepository.softDelete(id);
  }
}

export const categoryService = new CategoryService();
