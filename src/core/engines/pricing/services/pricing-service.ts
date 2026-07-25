import { PricingEngine, pricingEngine } from '../engine';
import type { PricingResult } from '../types';

export class PricingService {
  private engine: PricingEngine;

  constructor(engine?: PricingEngine) {
    this.engine = engine ?? pricingEngine;
  }

  async calculatePrice(request: Record<string, unknown>): Promise<PricingResult> {
    return this.engine.calculate(request);
  }
}

export const pricingService = new PricingService();
