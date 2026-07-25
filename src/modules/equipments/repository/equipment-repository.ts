import type { Equipment } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockEquipments: Equipment[] = [
  {
    id: 'eq-001', categoryId: 'eq-cat-001', costType: 'HOUR', code: 'IMP-001', name: 'Impressora HP Latex 360',
    description: 'Impressora de grande formato para lonas e adesivos',
    brand: 'HP', model: 'Latex 360',
    serialNumber: 'HP360-2024-001', patrimonyNumber: 'PAT-001', supplier: 'Distribuidora ABC',
    purchaseDate: new Date('2024-01-15'), purchaseValue: 45000, residualValue: 4500,
    hourCost: 25.50, dailyCost: 180.00, kmCost: 0, monthlyCost: 3600,
    fuelConsumption: null, capacity: null, unit: '', notes: '', active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2024-01-15'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'eq-002', categoryId: 'eq-cat-002', costType: 'HOUR', code: 'COR-001', name: 'Cortadeira Laser CO2',
    description: 'Cortadeira a laser para ACM e MDF',
    brand: 'Rayjet', model: 'C120',
    serialNumber: 'RJ-C120-2024-002', patrimonyNumber: 'PAT-002', supplier: 'Máquinas Brasil',
    purchaseDate: new Date('2024-03-01'), purchaseValue: 32000, residualValue: 3200,
    hourCost: 18.00, dailyCost: 130.00, kmCost: 0, monthlyCost: 2600,
    fuelConsumption: null, capacity: null, unit: '', notes: '', active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2024-03-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'eq-003', categoryId: 'eq-cat-003', costType: 'KM', code: 'VEI-001', name: 'Van Fiat Ducato',
    description: 'Van para transporte de materiais e equipes',
    brand: 'Fiat', model: 'Ducato 2023',
    serialNumber: 'FIAT-DUC-2023-003', patrimonyNumber: 'PAT-003', supplier: 'Fiat Automóveis',
    purchaseDate: new Date('2023-06-01'), purchaseValue: 185000, residualValue: 37000,
    hourCost: 0, dailyCost: 200.00, kmCost: 2.50, monthlyCost: 4000,
    fuelConsumption: 10.5, capacity: 1200, unit: 'KG', notes: '', active: true,
    companyId: COMPANY_ID,
    createdAt: new Date('2023-06-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
  {
    id: 'eq-004', categoryId: 'eq-cat-004', costType: 'DAY', code: 'FER-001', name: 'Furadeira Bosch GSB 180',
    description: 'Furadeira de impacto profissional',
    brand: 'Bosch', model: 'GSB 180-LI',
    serialNumber: 'BOSCH-GSB-2024-004', patrimonyNumber: 'PAT-004', supplier: 'LojaTech',
    purchaseDate: new Date('2024-05-01'), purchaseValue: 1200, residualValue: 120,
    hourCost: 3.50, dailyCost: 25.00, kmCost: 0, monthlyCost: 0,
    fuelConsumption: null, capacity: null, unit: '', notes: 'Em manutenção', active: false,
    companyId: COMPANY_ID,
    createdAt: new Date('2024-05-01'), updatedAt: new Date('2025-06-01'),
    deletedAt: null, createdBy: null, updatedBy: null, deletedBy: null,
  },
];

export class EquipmentRepository extends BaseRepository<Equipment, Equipment, Partial<Equipment>> {
  async findAll(): Promise<Equipment[]> {
    return mockEquipments
      .filter((e) => e.companyId === COMPANY_ID && !e.deletedAt)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<Equipment | null> {
    return mockEquipments.find((e) => e.id === id && !e.deletedAt) ?? null;
  }

  async findMany(filter: Partial<Equipment>): Promise<Equipment[]> {
    return mockEquipments.filter((e) =>
      Object.entries(filter).every(([key, value]) => e[key as keyof Equipment] === value)
    );
  }

  async getByCode(code: string): Promise<Equipment | null> {
    return mockEquipments.find((e) => e.code === code && !e.deletedAt) ?? null;
  }

  async create(data: Equipment): Promise<Equipment> {
    const item: Equipment = { ...data, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    mockEquipments.push(item);
    return item;
  }

  async update(id: string, data: Partial<Equipment>): Promise<Equipment> {
    const idx = mockEquipments.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Equipamento não encontrado');
    mockEquipments[idx] = { ...mockEquipments[idx], ...data, updatedAt: new Date() };
    return mockEquipments[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = mockEquipments.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Equipamento não encontrado');
    mockEquipments[idx] = { ...mockEquipments[idx], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<Equipment> {
    const idx = mockEquipments.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error('Equipamento não encontrado');
    mockEquipments[idx] = { ...mockEquipments[idx], deletedAt: null, updatedAt: new Date() };
    return mockEquipments[idx];
  }

  async toggleActive(id: string): Promise<Equipment> {
    const item = await this.findById(id);
    if (!item) throw new Error('Equipamento não encontrado');
    return this.update(id, { active: !item.active });
  }
}

export const equipmentRepository = new EquipmentRepository();
