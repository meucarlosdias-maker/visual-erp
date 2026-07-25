import type { PricingDetail, PricingStrategy } from '../types';

export class EquipmentCalculator implements PricingStrategy {
  readonly name = 'EQUIPMENT';

  calculate(details: PricingDetail[], _variables: Record<string, number>): number {
    return details
      .filter((d) => d.category === 'EQUIPMENT')
      .reduce((sum, d) => sum + d.totalCost, 0);
  }
}
