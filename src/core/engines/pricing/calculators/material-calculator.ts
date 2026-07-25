import type { PricingDetail, PricingStrategy } from '../types';

export class MaterialCalculator implements PricingStrategy {
  readonly name = 'MATERIAL';

  calculate(details: PricingDetail[], _variables: Record<string, number>): number {
    return details
      .filter((d) => d.category === 'MATERIAL')
      .reduce((sum, d) => sum + d.totalCost, 0);
  }
}
