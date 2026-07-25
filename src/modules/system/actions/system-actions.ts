'use server';

import { roleService } from '../services/role-service';
import { permissionService } from '../services/permission-service';
import { sessionService } from '../services/session-service';
import { auditService } from '../services/audit-service';
import { logService } from '../services/log-service';
import { securityService } from '../services/security-service';

export async function listRoles() {
  return roleService.list();
}

export async function getRole(id: string) {
  return roleService.getById(id);
}

export async function createRole(data: Record<string, unknown>) {
  return roleService.create(data as unknown as Parameters<typeof roleService.create>[0]);
}

export async function updateRole(id: string, data: Record<string, unknown>) {
  return roleService.update(id, data);
}

export async function deleteRole(id: string) {
  await roleService.delete(id);
}

export async function listPermissions() {
  return permissionService.list();
}

export async function getPermissionsByModule(module: string) {
  return permissionService.getByModule(module);
}

export async function getRolePermissions(roleId: string) {
  return permissionService.getRolePermissions(roleId);
}

export async function setRolePermissions(roleId: string, permissionIds: string[]) {
  await permissionService.setRolePermissions(roleId, permissionIds);
}

export async function listSessions() {
  return sessionService.list();
}

export async function listSessionsByUser(userId: string) {
  return sessionService.listByUserId(userId);
}

export async function revokeSession(id: string) {
  await sessionService.revoke(id);
}

export async function getActiveSessionCount() {
  return sessionService.getActiveCount();
}

export async function listAuditLogs() {
  return auditService.list();
}

export async function getAuditLog(id: string) {
  return auditService.getById(id);
}

export async function listSystemLogs() {
  return logService.list();
}

export async function purgeLogs(days: number) {
  await logService.purgeBefore(days);
}

export async function getSecuritySettings() {
  return securityService.get();
}

export async function updateSecuritySettings(data: Record<string, unknown>) {
  return securityService.update(data);
}
