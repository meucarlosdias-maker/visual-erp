import type { CostCategory } from '../types';

export interface ComponentData {
  id: string;
  name: string;
  category: CostCategory;
  unit: string;
  unitCost: number;
}

const MOCK_COMPONENTS: ComponentData[] = [
  { id: 'mat-001', name: 'Vinil', category: 'MATERIAL', unit: 'M2', unitCost: 42.00 },
  { id: 'mat-002', name: 'Lona Oléfina', category: 'MATERIAL', unit: 'M2', unitCost: 28.50 },
  { id: 'mat-003', name: 'Adesivo Vinílico', category: 'MATERIAL', unit: 'M2', unitCost: 18.00 },
  { id: 'lab-001', name: 'Mão de obra instalação', category: 'LABOR', unit: 'H', unitCost: 45.00 },
  { id: 'lab-002', name: 'Mão de obra produção', category: 'LABOR', unit: 'H', unitCost: 35.00 },
  { id: 'eq-001', name: 'Impressão digital', category: 'EQUIPMENT', unit: 'H', unitCost: 25.50 },
  { id: 'eq-002', name: 'Corte a laser', category: 'EQUIPMENT', unit: 'H', unitCost: 18.00 },
  { id: 'out-001', name: 'Acabamento terceirizado', category: 'OUTSOURCED', unit: 'UN', unitCost: 80.00 },
  { id: 'out-002', name: 'Serviço de galvanização', category: 'OUTSOURCED', unit: 'UN', unitCost: 120.00 },
  { id: 'trp-001', name: 'Frete entrega', category: 'TRANSPORT', unit: 'KM', unitCost: 3.50 },
  { id: 'trp-002', name: 'Frete coleta', category: 'TRANSPORT', unit: 'KM', unitCost: 3.50 },
];

export class PricingRepository {
  async getComponents(selectedIds: string[]): Promise<ComponentData[]> {
    return MOCK_COMPONENTS.filter((c) => selectedIds.includes(c.id));
  }

  async getAllComponents(): Promise<ComponentData[]> {
    return MOCK_COMPONENTS;
  }
}

export const pricingRepository = new PricingRepository();
