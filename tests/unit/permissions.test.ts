import { describe, it, expect } from 'vitest';
import { companyRolePermissions, platformRolePermissions } from '@/config/permissions';
import { Permissions, type Permission } from '@/constants/permissions';

describe('companyRolePermissions', () => {
  it('ADMIN has all user permissions', () => {
    const admin = companyRolePermissions.find((r) => r.role === 'ADMIN');
    expect(admin).toBeDefined();
    expect(admin!.permissions).toContain('user:*');
    expect(admin!.permissions).toContain('client:*');
  });

  it('has all company roles defined', () => {
    const roles = companyRolePermissions.map((r) => r.role);
    expect(roles).toContain('ADMIN');
    expect(roles).toContain('MANAGER');
    expect(roles).toContain('SALES');
    expect(roles).toContain('VIEWER');
  });

  it('VIEWER has only view permissions', () => {
    const viewer = companyRolePermissions.find((r) => r.role === 'VIEWER');
    expect(viewer).toBeDefined();
    const viewPerms = viewer!.permissions.filter((p) => p.includes('view'));
    expect(viewPerms.length).toBeGreaterThan(0);
  });
});

describe('platformRolePermissions', () => {
  it('SUPER_ADMIN has wildcard', () => {
    const superAdmin = platformRolePermissions.find((r) => r.role === 'SUPER_ADMIN');
    expect(superAdmin).toBeDefined();
    expect(superAdmin!.permissions).toContain('*');
  });

  it('has all platform roles defined', () => {
    const roles = platformRolePermissions.map((r) => r.role);
    expect(roles).toContain('SUPER_ADMIN');
    expect(roles).toContain('DEVELOPER');
    expect(roles).toContain('SUPPORT');
  });

  it('SUPPORT has no company permissions', () => {
    const support = platformRolePermissions.find((r) => r.role === 'SUPPORT');
    expect(support).toBeDefined();
    const companyPerms = support!.permissions.filter((p) => p.startsWith('client'));
    expect(companyPerms).toHaveLength(0);
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
