import type { Material } from '../types';
import { materialRepository } from '../repository/material-repository';
import { materialFormSchema } from '../schemas/material-schema';
import { BaseService } from '@/lib/service-base';
import type { MaterialRepository } from '../repository/material-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';
const USER_ID = '00000000-0000-0000-0000-000000000000';

export class MaterialService extends BaseService<Material, Record<string, unknown>, Record<string, unknown>, MaterialRepository> {
  constructor() {
    super(materialRepository);
  }

  protected entityName = 'Material';

  async list(): Promise<Material[]> {
    return (this.repository as MaterialRepository).findAll();
  }

  async create(data: Record<string, unknown>): Promise<Material> {
    const parsed = materialFormSchema.parse(data);
    const now = new Date();
    return (this.repository as MaterialRepository).create({
      id: crypto.randomUUID(),
      ...parsed,
      companyId: COMPANY_ID,
      createdAt: now, updatedAt: now,
      deletedAt: null, createdBy: USER_ID, updatedBy: USER_ID, deletedBy: null,
    } as Material);
  }

  async update(id: string, data: Record<string, unknown>): Promise<Material> {
    return (this.repository as MaterialRepository).update(id, { ...data, updatedBy: USER_ID });
  }

  async toggleActive(id: string): Promise<Material> {
    return (this.repository as MaterialRepository).toggleActive(id);
  }
}

export const materialService = new MaterialService();
