import type { PricingDetail, PricingStrategy } from '../types';

export class OutsourcedCalculator implements PricingStrategy {
  readonly name = 'OUTSOURCED';

  calculate(details: PricingDetail[], _variables: Record<string, number>): number {
    return details
      .filter((d) => d.category === 'OUTSOURCED')
      .reduce((sum, d) => sum + d.totalCost, 0);
  }
}
