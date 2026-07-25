import { equipmentCategoryRepository } from '../repository/equipment-category-repository';
import { equipmentCategorySchema } from '../schemas/equipment-category-schema';
import type { EquipmentCategory } from '../types';
import { BaseService } from '@/lib/service-base';
import type { EquipmentCategoryRepository } from '../repository/equipment-category-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class EquipmentCategoryService extends BaseService<EquipmentCategory, Record<string, unknown>, Record<string, unknown>, EquipmentCategoryRepository> {
  constructor() {
    super(equipmentCategoryRepository);
  }

  protected entityName = 'Categoria de Equipamento';

  async list(): Promise<EquipmentCategory[]> {
    return (this.repository as EquipmentCategoryRepository).findAll();
  }

  async create(data: Record<string, unknown>): Promise<EquipmentCategory> {
    const parsed = equipmentCategorySchema.omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true, createdBy: true, updatedBy: true, deletedBy: true }).parse({ ...data, companyId: COMPANY_ID });
    return (this.repository as EquipmentCategoryRepository).create(parsed as EquipmentCategory);
  }

  async update(id: string, data: Record<string, unknown>): Promise<EquipmentCategory> {
    return (this.repository as EquipmentCategoryRepository).update(id, data);
  }

  async toggleActive(id: string): Promise<EquipmentCategory> {
    return (this.repository as EquipmentCategoryRepository).toggleActive(id);
  }
}

export const equipmentCategoryService = new EquipmentCategoryService();
