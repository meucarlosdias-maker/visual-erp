import type { Role } from '../types';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockRoles: Role[] = [
  { id: 'role-001', companyId: COMPANY_ID, name: 'Administrador', description: 'Acesso total ao sistema', color: '#ef4444', isSystem: true, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: 'role-002', companyId: COMPANY_ID, name: 'Gerente', description: 'Acesso gerencial', color: '#3b82f6', isSystem: false, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: 'role-003', companyId: COMPANY_ID, name: 'Supervisor', description: 'Supervisão de produção', color: '#f59e0b', isSystem: false, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: 'role-004', companyId: COMPANY_ID, name: 'Operador', description: 'Operação básica', color: '#10b981', isSystem: false, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: 'role-005', companyId: COMPANY_ID, name: 'Financeiro', description: 'Acesso ao módulo financeiro', color: '#8b5cf6', isSystem: false, active: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  { id: 'role-006', companyId: COMPANY_ID, name: 'Consultor', description: 'Acesso apenas visual', color: '#78716c', isSystem: false, active: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
];

export class RoleRepository {
  async list(companyId: string): Promise<Role[]> {
    return mockRoles.filter((r) => !r.deletedAt);
  }

  async getById(id: string): Promise<Role | null> {
    return mockRoles.find((r) => r.id === id && !r.deletedAt) ?? null;
  }

  async create(data: Role): Promise<Role> {
    mockRoles.push(data);
    return data;
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const idx = mockRoles.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Papel não encontrado');
    mockRoles[idx] = { ...mockRoles[idx], ...data, updatedAt: new Date() };
    return mockRoles[idx];
  }

  async delete(id: string): Promise<void> {
    const idx = mockRoles.findIndex((r) => r.id === id);
    if (idx !== -1) mockRoles.splice(idx, 1);
  }
}

export const roleRepository = new RoleRepository();
