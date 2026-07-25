import { componentRepository } from '../repository/component-repository';
import { componentFormSchema } from '../schemas/component-schema';
import type { ServiceComponent } from '../types';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export class ComponentService {
  async listByService(serviceId: string): Promise<ServiceComponent[]> {
    return componentRepository.listByService(serviceId);
  }

  async getById(id: string): Promise<ServiceComponent | null> {
    return componentRepository.getById(id);
  }

  async create(data: Record<string, unknown>): Promise<ServiceComponent> {
    const parsed = componentFormSchema.parse(data);
    const now = new Date();
    return componentRepository.create({
      id: crypto.randomUUID(),
      ...parsed,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: USER_ID,
      updatedBy: USER_ID,
      deletedBy: null,
    });
  }

  async update(id: string, data: Record<string, unknown>): Promise<ServiceComponent> {
    return componentRepository.update(id, { ...data, updatedBy: USER_ID });
  }

  async delete(id: string): Promise<void> {
    await componentRepository.softDelete(id);
  }
}

export const componentService = new ComponentService();
