import { permissionRepository } from '../repository/permission-repository';
import type { Permission } from '../types';

export class PermissionService {
  async list(): Promise<Permission[]> {
    return permissionRepository.list();
  }

  async getByModule(module: string): Promise<Permission[]> {
    return permissionRepository.getByModule(module);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    return permissionRepository.getRolePermissions(roleId);
  }

  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    return permissionRepository.setRolePermissions(roleId, permissionIds);
  }
}

export const permissionService = new PermissionService();
