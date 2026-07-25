import type { Permission, RolePermission } from '../types';

const mockPermissions: Permission[] = [
  { id: 'perm-001', module: 'clientes', action: 'view', name: 'Visualizar Clientes', description: '' },
  { id: 'perm-002', module: 'clientes', action: 'create', name: 'Criar Clientes', description: '' },
  { id: 'perm-003', module: 'clientes', action: 'edit', name: 'Editar Clientes', description: '' },
  { id: 'perm-004', module: 'clientes', action: 'delete', name: 'Excluir Clientes', description: '' },
  { id: 'perm-005', module: 'clientes', action: 'approve', name: 'Aprovar Clientes', description: '' },
  { id: 'perm-006', module: 'clientes', action: 'export', name: 'Exportar Clientes', description: '' },
  { id: 'perm-007', module: 'clientes', action: 'configure', name: 'Configurar Clientes', description: '' },
  { id: 'perm-008', module: 'crm', action: 'view', name: 'Visualizar CRM', description: '' },
  { id: 'perm-009', module: 'crm', action: 'create', name: 'Criar no CRM', description: '' },
  { id: 'perm-010', module: 'crm', action: 'edit', name: 'Editar no CRM', description: '' },
  { id: 'perm-011', module: 'crm', action: 'delete', name: 'Excluir no CRM', description: '' },
  { id: 'perm-012', module: 'crm', action: 'approve', name: 'Aprovar no CRM', description: '' },
  { id: 'perm-013', module: 'crm', action: 'export', name: 'Exportar CRM', description: '' },
  { id: 'perm-014', module: 'crm', action: 'configure', name: 'Configurar CRM', description: '' },
  { id: 'perm-015', module: 'projetos', action: 'view', name: 'Visualizar Projetos', description: '' },
  { id: 'perm-016', module: 'projetos', action: 'create', name: 'Criar Projetos', description: '' },
  { id: 'perm-017', module: 'projetos', action: 'edit', name: 'Editar Projetos', description: '' },
  { id: 'perm-018', module: 'projetos', action: 'delete', name: 'Excluir Projetos', description: '' },
  { id: 'perm-019', module: 'projetos', action: 'approve', name: 'Aprovar Projetos', description: '' },
  { id: 'perm-020', module: 'projetos', action: 'export', name: 'Exportar Projetos', description: '' },
  { id: 'perm-021', module: 'projetos', action: 'configure', name: 'Configurar Projetos', description: '' },
  { id: 'perm-022', module: 'producao', action: 'view', name: 'Visualizar Produção', description: '' },
  { id: 'perm-023', module: 'producao', action: 'create', name: 'Criar Produção', description: '' },
  { id: 'perm-024', module: 'producao', action: 'edit', name: 'Editar Produção', description: '' },
  { id: 'perm-025', module: 'producao', action: 'delete', name: 'Excluir Produção', description: '' },
  { id: 'perm-026', module: 'producao', action: 'approve', name: 'Aprovar Produção', description: '' },
  { id: 'perm-027', module: 'producao', action: 'export', name: 'Exportar Produção', description: '' },
  { id: 'perm-028', module: 'producao', action: 'configure', name: 'Configurar Produção', description: '' },
  { id: 'perm-029', module: 'instalacao', action: 'view', name: 'Visualizar Instalação', description: '' },
  { id: 'perm-030', module: 'instalacao', action: 'create', name: 'Criar Instalação', description: '' },
  { id: 'perm-031', module: 'instalacao', action: 'edit', name: 'Editar Instalação', description: '' },
  { id: 'perm-032', module: 'instalacao', action: 'delete', name: 'Excluir Instalação', description: '' },
  { id: 'perm-033', module: 'instalacao', action: 'approve', name: 'Aprovar Instalação', description: '' },
  { id: 'perm-034', module: 'instalacao', action: 'export', name: 'Exportar Instalação', description: '' },
  { id: 'perm-035', module: 'instalacao', action: 'configure', name: 'Configurar Instalação', description: '' },
  { id: 'perm-036', module: 'financeiro', action: 'view', name: 'Visualizar Financeiro', description: '' },
  { id: 'perm-037', module: 'financeiro', action: 'create', name: 'Criar Financeiro', description: '' },
  { id: 'perm-038', module: 'financeiro', action: 'edit', name: 'Editar Financeiro', description: '' },
  { id: 'perm-039', module: 'financeiro', action: 'delete', name: 'Excluir Financeiro', description: '' },
  { id: 'perm-040', module: 'financeiro', action: 'approve', name: 'Aprovar Financeiro', description: '' },
  { id: 'perm-041', module: 'financeiro', action: 'export', name: 'Exportar Financeiro', description: '' },
  { id: 'perm-042', module: 'financeiro', action: 'configure', name: 'Configurar Financeiro', description: '' },
  { id: 'perm-043', module: 'agenda', action: 'view', name: 'Visualizar Agenda', description: '' },
  { id: 'perm-044', module: 'agenda', action: 'create', name: 'Criar Agenda', description: '' },
  { id: 'perm-045', module: 'agenda', action: 'edit', name: 'Editar Agenda', description: '' },
  { id: 'perm-046', module: 'agenda', action: 'delete', name: 'Excluir Agenda', description: '' },
  { id: 'perm-047', module: 'agenda', action: 'approve', name: 'Aprovar Agenda', description: '' },
  { id: 'perm-048', module: 'agenda', action: 'export', name: 'Exportar Agenda', description: '' },
  { id: 'perm-049', module: 'agenda', action: 'configure', name: 'Configurar Agenda', description: '' },
  { id: 'perm-050', module: 'configuracoes', action: 'view', name: 'Visualizar Configurações', description: '' },
  { id: 'perm-051', module: 'configuracoes', action: 'create', name: 'Criar Configurações', description: '' },
  { id: 'perm-052', module: 'configuracoes', action: 'edit', name: 'Editar Configurações', description: '' },
  { id: 'perm-053', module: 'configuracoes', action: 'delete', name: 'Excluir Configurações', description: '' },
  { id: 'perm-054', module: 'configuracoes', action: 'approve', name: 'Aprovar Configurações', description: '' },
  { id: 'perm-055', module: 'configuracoes', action: 'export', name: 'Exportar Configurações', description: '' },
  { id: 'perm-056', module: 'configuracoes', action: 'configure', name: 'Configurar Configurações', description: '' },
  { id: 'perm-057', module: 'administracao', action: 'view', name: 'Visualizar Administração', description: '' },
  { id: 'perm-058', module: 'administracao', action: 'create', name: 'Criar Administração', description: '' },
  { id: 'perm-059', module: 'administracao', action: 'edit', name: 'Editar Administração', description: '' },
  { id: 'perm-060', module: 'administracao', action: 'delete', name: 'Excluir Administração', description: '' },
  { id: 'perm-061', module: 'administracao', action: 'approve', name: 'Aprovar Administração', description: '' },
  { id: 'perm-062', module: 'administracao', action: 'export', name: 'Exportar Administração', description: '' },
  { id: 'perm-063', module: 'administracao', action: 'configure', name: 'Configurar Administração', description: '' },
];

const mockRolePermissions: RolePermission[] = [
  ...mockPermissions.map((p) => ({ id: crypto.randomUUID(), roleId: 'role-001', permissionId: p.id })),
  ...mockPermissions.filter((p) =>
    ['clientes', 'crm', 'projetos', 'financeiro', 'agenda'].includes(p.module) &&
    ['view', 'create', 'edit'].includes(p.action)
  ).map((p) => ({ id: crypto.randomUUID(), roleId: 'role-002', permissionId: p.id })),
  ...mockPermissions.filter((p) =>
    ['producao', 'instalacao'].includes(p.module) && ['view'].includes(p.action)
  ).map((p) => ({ id: crypto.randomUUID(), roleId: 'role-003', permissionId: p.id })),
  ...mockPermissions.filter((p) =>
    ['producao', 'instalacao'].includes(p.module) && ['view', 'create', 'edit'].includes(p.action)
  ).map((p) => ({ id: crypto.randomUUID(), roleId: 'role-004', permissionId: p.id })),
  ...mockPermissions.filter((p) =>
    p.module === 'financeiro' && ['view', 'create', 'edit', 'approve', 'export'].includes(p.action)
  ).map((p) => ({ id: crypto.randomUUID(), roleId: 'role-005', permissionId: p.id })),
];

export class PermissionRepository {
  async list(): Promise<Permission[]> {
    return [...mockPermissions];
  }

  async getByModule(module: string): Promise<Permission[]> {
    return mockPermissions.filter((p) => p.module === module);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    return mockRolePermissions
      .filter((rp) => rp.roleId === roleId)
      .map((rp) => rp.permissionId);
  }

  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    const toRemove = mockRolePermissions.filter((rp) => rp.roleId === roleId);
    for (const rp of toRemove) {
      const idx = mockRolePermissions.indexOf(rp);
      if (idx !== -1) mockRolePermissions.splice(idx, 1);
    }
    for (const permId of permissionIds) {
      mockRolePermissions.push({ id: crypto.randomUUID(), roleId, permissionId: permId });
    }
  }
}

export const permissionRepository = new PermissionRepository();
