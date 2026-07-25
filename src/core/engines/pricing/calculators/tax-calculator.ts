import type { PricingDetail, PricingStrategy } from '../types';

export class TaxCalculator implements PricingStrategy {
  readonly name = 'TAX';

  calculate(details: PricingDetail[], variables: Record<string, number>): number {
    const subtotal = details.reduce((sum, d) => sum + d.totalCost, 0);
    const taxPercent = variables.impostos ?? 0;
    return subtotal * (taxPercent / 100);
  }

  buildTaxDetail(subtotal: number, taxPercent: number): PricingDetail {
    return {
      componentId: 'tax',
      componentName: `Impostos (${taxPercent}%)`,
      category: 'TAX',
      quantity: 1,
      unit: '%',
      unitCost: taxPercent,
      totalCost: subtotal * (taxPercent / 100),
    };
  }
}
