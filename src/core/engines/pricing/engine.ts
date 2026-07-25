import {
  MaterialCalculator,
  LaborCalculator,
  EquipmentCalculator,
  OutsourcedCalculator,
  TransportCalculator,
  TaxCalculator,
  MarginCalculator,
  TotalCalculator,
} from './calculators';
import { PricingRepository } from './repository';
import { pricingRequestSchema } from './validators';
import type { PricingRequest, PricingResult, PricingDetail, PricingStrategy, CostCategory } from './types';

export class PricingEngine {
  private strategies: PricingStrategy[];
  private taxCalculator = new TaxCalculator();
  private marginCalculator = new MarginCalculator();
  private totalCalculator = new TotalCalculator();
  private repository: PricingRepository;

  constructor(repository?: PricingRepository) {
    this.repository = repository ?? new PricingRepository();
    this.strategies = [
      new MaterialCalculator(),
      new LaborCalculator(),
      new EquipmentCalculator(),
      new OutsourcedCalculator(),
      new TransportCalculator(),
    ];
  }

  async calculate(request: Record<string, unknown>): Promise<PricingResult> {
    const parsed = pricingRequestSchema.parse(request);
    return this.execute(parsed);
  }

  private async execute(request: PricingRequest): Promise<PricingResult> {
    const { serviceId, companyId, quantity, variables, selectedComponents } = request;

    const components = await this.repository.getComponents(selectedComponents);

    const details = this.buildDetails(components, quantity, variables);

    const costs: Record<string, number> = {};
    for (const strategy of this.strategies) {
      costs[strategy.name] = strategy.calculate(details, variables);
    }

    const pretaxSubtotal = this.totalCalculator.calculate(Object.values(costs));

    const taxPercent = variables.impostos ?? 0;
    const taxDetail = this.taxCalculator.buildTaxDetail(pretaxSubtotal, taxPercent);
    const allDetails = [...details, taxDetail];

    const taxCost = taxDetail.totalCost;

    const subtotal = pretaxSubtotal + taxCost;

    const allCosts = { ...costs, TAX: taxCost };
    const margin = this.marginCalculator.calculate(allDetails, variables);

    const salePrice = subtotal + margin;

    return {
      serviceId,
      companyId,
      materialCost: costs.MATERIAL ?? 0,
      laborCost: costs.LABOR ?? 0,
      equipmentCost: costs.EQUIPMENT ?? 0,
      outsourcedCost: costs.OUTSOURCED ?? 0,
      transportCost: costs.TRANSPORT ?? 0,
      taxCost,
      subtotal,
      margin,
      salePrice,
      details: allDetails,
      calculatedAt: new Date(),
    };
  }

  private buildDetails(
    components: { id: string; name: string; category: CostCategory; unit: string; unitCost: number }[],
    quantity: number,
    variables: Record<string, number>,
  ): PricingDetail[] {
    return components.map((comp) => {
      const qty = this.resolveQuantity(comp, quantity, variables);
      return {
        componentId: comp.id,
        componentName: comp.name,
        category: comp.category,
        quantity: qty,
        unit: comp.unit,
        unitCost: comp.unitCost,
        totalCost: qty * comp.unitCost,
      };
    });
  }

  private resolveQuantity(
    _comp: { id: string; name: string; category: CostCategory; unit: string; unitCost: number },
    quantity: number,
    variables: Record<string, number>,
  ): number {
    if (variables.area && variables.area > 0) return variables.area;
    if (variables.quantidade && variables.quantidade > 0) return variables.quantidade;
    if (variables.horas && variables.horas > 0) return variables.horas;
    if (variables.quilometros && variables.quilometros > 0) return variables.quilometros;
    return quantity;
  }
}

export const pricingEngine = new PricingEngine();
