import type { PricingDetail, PricingStrategy } from '../types';

export class TransportCalculator implements PricingStrategy {
  readonly name = 'TRANSPORT';

  calculate(details: PricingDetail[], _variables: Record<string, number>): number {
    return details
      .filter((d) => d.category === 'TRANSPORT')
      .reduce((sum, d) => sum + d.totalCost, 0);
  }
}
