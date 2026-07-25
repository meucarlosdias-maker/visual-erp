import { roleRepository } from '../repository/role-repository';
import type { Role, RoleForm } from '../types';
import { roleSchema } from '../schemas';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class RoleService {
  async list(): Promise<Role[]> {
    return roleRepository.list(COMPANY_ID);
  }

  async getById(id: string): Promise<Role | null> {
    return roleRepository.getById(id);
  }

  async create(data: RoleForm): Promise<Role> {
    const now = new Date();
    const role: Role = roleSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
      isSystem: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
    return roleRepository.create(role);
  }

  async update(id: string, data: Partial<RoleForm>): Promise<Role> {
    return roleRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return roleRepository.delete(id);
  }
}

export const roleService = new RoleService();
