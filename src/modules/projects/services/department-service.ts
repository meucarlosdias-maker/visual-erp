import { departmentRepository } from '../repository/department-repository';
import { departmentSchema } from '../schemas';
import { BaseService } from '@/lib/service-base';
import type { Department } from '../types';
import type { DepartmentRepository } from '../repository/department-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class DepartmentService extends BaseService<Department, Record<string, unknown>, Record<string, unknown>, DepartmentRepository> {
  constructor() {
    super(departmentRepository);
  }

  protected entityName = 'Departamento';

  async list(): Promise<Department[]> {
    return departmentRepository.findAll();
  }

  async create(data: Record<string, unknown>): Promise<Department> {
    const parsed = departmentSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      companyId: COMPANY_ID,
    });
    return departmentRepository.create(parsed);
  }

  async update(id: string, data: Record<string, unknown>): Promise<Department> {
    return departmentRepository.update(id, data);
  }
}

export const departmentService = new DepartmentService();
