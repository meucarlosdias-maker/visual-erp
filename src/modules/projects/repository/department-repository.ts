import type { Department } from '../types';
import { BaseRepository } from '@/lib/repository-base';
import { DEPARTMENTS_SEED } from '../validators';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockDepartments: Department[] = DEPARTMENTS_SEED.map((dept) => ({
  id: `dept-${dept.name.toLowerCase()}`,
  companyId: COMPANY_ID,
  ...dept,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
  deletedBy: null,
}));

export class DepartmentRepository extends BaseRepository<Department, Department, Partial<Department>> {
  async findAll(): Promise<Department[]> {
    return mockDepartments
      .filter((d) => d.active && !d.deletedAt)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async findById(id: string): Promise<Department | null> {
    return mockDepartments.find((d) => d.id === id && !d.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Department>): Promise<Department[]> {
    return mockDepartments.filter((d) =>
      !d.deletedAt && Object.entries(filter).every(([key, value]) => d[key as keyof Department] === value)
    );
  }

  async create(data: Department): Promise<Department> {
    mockDepartments.push(data);
    return data;
  }

  async update(id: string, data: Partial<Department>): Promise<Department> {
    const idx = mockDepartments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Departamento não encontrado');
    mockDepartments[idx] = { ...mockDepartments[idx], ...data };
    return mockDepartments[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockDepartments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Departamento não encontrado');
    mockDepartments[idx] = { ...mockDepartments[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<Department> {
    const idx = mockDepartments.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Departamento não encontrado');
    mockDepartments[idx] = { ...mockDepartments[idx], deletedAt: null, updatedAt: new Date() };
    return mockDepartments[idx];
  }
}

export const departmentRepository = new DepartmentRepository();
