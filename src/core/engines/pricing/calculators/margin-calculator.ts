import type { PricingDetail, PricingStrategy } from '../types';

export class MarginCalculator implements PricingStrategy {
  readonly name = 'MARGIN';

  calculate(details: PricingDetail[], variables: Record<string, number>): number {
    const subtotal = details.reduce((sum, d) => sum + d.totalCost, 0);
    const marginPercent = variables.margem ?? 0;
    return subtotal * (marginPercent / 100);
  }
}
