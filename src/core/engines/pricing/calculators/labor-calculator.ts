import type { PricingDetail, PricingStrategy } from '../types';

export class LaborCalculator implements PricingStrategy {
  readonly name = 'LABOR';

  calculate(details: PricingDetail[], _variables: Record<string, number>): number {
    return details
      .filter((d) => d.category === 'LABOR')
      .reduce((sum, d) => sum + d.totalCost, 0);
  }
}
