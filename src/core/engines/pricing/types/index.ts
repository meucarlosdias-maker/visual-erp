export type { PricingLogEntry, PricingLog } from './log';

export type CostCategory =
  | 'MATERIAL'
  | 'LABOR'
  | 'EQUIPMENT'
  | 'OUTSOURCED'
  | 'TRANSPORT'
  | 'TAX';

export interface PricingRequest {
  serviceId: string;
  companyId: string;
  quantity: number;
  variables: Record<string, number>;
  selectedComponents: string[];
}

export interface PricingDetail {
  componentId: string;
  componentName: string;
  category: CostCategory;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface PricingResult {
  serviceId: string;
  companyId: string;
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  outsourcedCost: number;
  transportCost: number;
  taxCost: number;
  subtotal: number;
  margin: number;
  salePrice: number;
  details: PricingDetail[];
  calculatedAt: Date;
}

export interface PricingStrategy {
  readonly name: string;
  calculate(details: PricingDetail[], variables: Record<string, number>): number;
}
