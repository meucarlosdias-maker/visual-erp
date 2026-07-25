import { describe, it, expect } from 'vitest';
import { rolePermissions } from '@/config/permissions';
import { Permissions, type Permission } from '@/constants/permissions';

describe('rolePermissions', () => {
  it('has SUPER_ADMIN with wildcard', () => {
    const superAdmin = rolePermissions.find((r) => r.role === 'SUPER_ADMIN');
    expect(superAdmin).toBeDefined();
    expect(superAdmin!.permissions).toContain('*');
  });

  it('has all roles defined', () => {
    const roles = rolePermissions.map((r) => r.role);
    expect(roles).toContain('SUPER_ADMIN');
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('MANAGER');
    expect(roles).toContain('TEAM_MEMBER');
    expect(roles).toContain('VIEWER');
  });

  it('ADMIN has all user permissions', () => {
    const admin = rolePermissions.find((r) => r.role === 'ADMIN');
    expect(admin!.permissions).toContain('user:*');
    expect(admin!.permissions).toContain('client:*');
  });

  it('VIEWER has only view permissions', () => {
    const viewer = rolePermissions.find((r) => r.role === 'VIEWER');
    expect(viewer!.permissions.length).toBe(3);
    const viewPerms = viewer!.permissions.filter((p) => p.includes('view'));
    expect(viewPerms.length).toBe(3);
  });
});

describe('Permissions constant', () => {
  it('has all CRUD permissions', () => {
    expect(Permissions.COMPANY_VIEW).toBe('company.view');
    expect(Permissions.USER_CREATE).toBe('user.create');
    expect(Permissions.CLIENT_UPDATE).toBe('client.update');
    expect(Permissions.PROJECT_DELETE).toBe('project.delete');
  });

  it('has correct type shape', () => {
    const perm: Permission = 'company.view';
    expect(perm).toBeDefined();
  });
});
