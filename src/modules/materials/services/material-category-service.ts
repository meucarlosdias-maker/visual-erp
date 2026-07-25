import type { MaterialCategory } from '../types';
import { materialCategoryRepository } from '../repository/material-category-repository';
import { materialCategoryFormSchema } from '../schemas/material-category-schema';
import { BaseService } from '@/lib/service-base';
import type { MaterialCategoryRepository } from '../repository/material-category-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class MaterialCategoryService extends BaseService<MaterialCategory, Record<string, unknown>, Record<string, unknown>, MaterialCategoryRepository> {
  constructor() {
    super(materialCategoryRepository);
  }

  protected entityName = 'Categoria de Material';

  async list(): Promise<MaterialCategory[]> {
    return (this.repository as MaterialCategoryRepository).findAll();
  }

  async create(data: Record<string, unknown>): Promise<MaterialCategory> {
    const parsed = materialCategoryFormSchema.parse(data);
    return (this.repository as MaterialCategoryRepository).create({
      ...parsed,
      companyId: COMPANY_ID,
    } as MaterialCategory);
  }

  async update(id: string, data: Record<string, unknown>): Promise<MaterialCategory> {
    const parsed = materialCategoryFormSchema.partial().parse(data);
    return (this.repository as MaterialCategoryRepository).update(id, parsed);
  }

  async toggleActive(id: string): Promise<MaterialCategory> {
    return (this.repository as MaterialCategoryRepository).toggleActive(id);
  }
}

export const materialCategoryService = new MaterialCategoryService();
