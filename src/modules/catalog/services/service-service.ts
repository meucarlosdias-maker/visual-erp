import { serviceRepository } from '../repository/service-repository';
import { serviceFormSchema } from '../schemas/service-schema';
import type { CatalogService } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';
const USER_ID = '00000000-0000-0000-0000-000000000000';

export class ServiceService {
  async list(filters?: { categoryId?: string; subcategoryId?: string }): Promise<CatalogService[]> {
    return serviceRepository.list(COMPANY_ID, filters);
  }

  async getById(id: string): Promise<CatalogService | null> {
    return serviceRepository.getById(id);
  }

  async create(data: Record<string, unknown>): Promise<CatalogService> {
    const parsed = serviceFormSchema.parse(data);
    const now = new Date();
    return serviceRepository.create({
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

  async update(id: string, data: Record<string, unknown>): Promise<CatalogService> {
    return serviceRepository.update(id, { ...data, updatedBy: USER_ID });
  }

  async delete(id: string): Promise<void> {
    await serviceRepository.softDelete(id);
  }

  async toggleActive(id: string): Promise<CatalogService> {
    return serviceRepository.toggleActive(id);
  }
}

export const serviceService = new ServiceService();
