import { equipmentRepository } from '../repository/equipment-repository';
import { equipmentSchema } from '../schemas/equipment-schema';
import type { Equipment } from '../types';
import { BaseService } from '@/lib/service-base';
import type { EquipmentRepository } from '../repository/equipment-repository';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export class EquipmentService extends BaseService<Equipment, Record<string, unknown>, Record<string, unknown>, EquipmentRepository> {
  constructor() {
    super(equipmentRepository);
  }

  protected entityName = 'Equipamento';

  async list(): Promise<Equipment[]> {
    return (this.repository as EquipmentRepository).findAll();
  }

  async create(data: Record<string, unknown>): Promise<Equipment> {
    const parsed = equipmentSchema.omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true, createdBy: true, updatedBy: true, deletedBy: true }).parse({ ...data, companyId: COMPANY_ID });
    return (this.repository as EquipmentRepository).create(parsed as Equipment);
  }

  async update(id: string, data: Record<string, unknown>): Promise<Equipment> {
    return (this.repository as EquipmentRepository).update(id, data);
  }

  async toggleActive(id: string): Promise<Equipment> {
    return (this.repository as EquipmentRepository).toggleActive(id);
  }
}

export const equipmentService = new EquipmentService();
