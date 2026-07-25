import type { PluginRecord } from '../types';

class PluginPermissionManager {
  private pluginPermissions = new Map<string, Set<string>>();

  register(pluginId: string, permissions: string[]): void {
    this.pluginPermissions.set(pluginId, new Set(permissions));
  }

  unregister(pluginId: string): void {
    this.pluginPermissions.delete(pluginId);
  }

  hasPermission(pluginId: string, permission: string): boolean {
    const permissions = this.pluginPermissions.get(pluginId);
    if (!permissions) return false;
    return permissions.has(permission) || permissions.has('*');
  }

  hasAnyPermission(pluginId: string, required: string[]): boolean {
    return required.some((p) => this.hasPermission(pluginId, p));
  }

  hasAllPermissions(pluginId: string, required: string[]): boolean {
    return required.every((p) => this.hasPermission(pluginId, p));
  }

  getPermissions(pluginId: string): string[] {
    return Array.from(this.pluginPermissions.get(pluginId) ?? []);
  }

  validatePluginAccess(plugin: PluginRecord, requiredPermission: string): boolean {
    if (!plugin.enabled) return false;
    return this.hasPermission(plugin.id, requiredPermission);
  }

  clear(): void {
    this.pluginPermissions.clear();
  }
}

export const pluginPermissionManager = new PluginPermissionManager();
