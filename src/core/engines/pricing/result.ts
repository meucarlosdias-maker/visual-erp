import type { PricingResult } from './types';

export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2)}`;
}

export function pricingResultSummary(result: PricingResult): string {
  const lines = [
    `Serviço: ${result.serviceId}`,
    `--- Custos ---`,
    `Materiais: ${formatCurrency(result.materialCost)}`,
    `Mão de Obra: ${formatCurrency(result.laborCost)}`,
    `Equipamentos: ${formatCurrency(result.equipmentCost)}`,
    `Terceiros: ${formatCurrency(result.outsourcedCost)}`,
    `Frete: ${formatCurrency(result.transportCost)}`,
    `Impostos: ${formatCurrency(result.taxCost)}`,
    `---`,
    `Subtotal: ${formatCurrency(result.subtotal)}`,
    `Margem: ${formatCurrency(result.margin)}`,
    `Preço Final: ${formatCurrency(result.salePrice)}`,
    ``,
    `--- Detalhamento ---`,
    ...result.details.map(
      (d) => `${d.componentName}: ${d.quantity} ${d.unit} x ${formatCurrency(d.unitCost)} = ${formatCurrency(d.totalCost)}`,
    ),
  ];
  return lines.join('\n');
}
