export interface EntityRef {
  id: string;
  label: string;
}

export interface IntegrationFlow {
  leadId?: string;
  clientId?: string;
  visitId?: string;
  quotationId?: string;
  projectId?: string;
  workOrderId?: string;
  productionOrderId?: string;
  installationId?: string;
  deliveryId?: string;
  financialId?: string;
}

export const FLOW_LABELS: Record<keyof IntegrationFlow, string> = {
  leadId: 'Lead',
  clientId: 'Cliente',
  visitId: 'Visita',
  quotationId: 'Orçamento',
  projectId: 'Projeto',
  workOrderId: 'Ordem de Serviço',
  productionOrderId: 'Ordem de Produção',
  installationId: 'Instalação',
  deliveryId: 'Entrega',
  financialId: 'Financeiro',
};

export const FLOW_ORDER: (keyof IntegrationFlow)[] = [
  'leadId', 'clientId', 'visitId', 'quotationId', 'projectId',
  'workOrderId', 'productionOrderId', 'installationId', 'deliveryId', 'financialId',
];

export class IntegrationService {
  getFlow(filters: Partial<IntegrationFlow>): IntegrationFlow {
    return {
      leadId: undefined,
      clientId: undefined,
      visitId: undefined,
      quotationId: undefined,
      projectId: undefined,
      workOrderId: undefined,
      productionOrderId: undefined,
      installationId: undefined,
      deliveryId: undefined,
      financialId: undefined,
      ...filters,
    };
  }

  getFlowSummary(flow: IntegrationFlow): string[] {
    return FLOW_ORDER
      .filter((key) => flow[key])
      .map((key) => `${FLOW_LABELS[key]}: ${flow[key]!.slice(0, 8)}...`);
  }

  canAdvance(flow: IntegrationFlow, target: keyof IntegrationFlow): boolean {
    const targetIdx = FLOW_ORDER.indexOf(target);
    if (targetIdx <= 0) return true;
    const prevKey = FLOW_ORDER[targetIdx - 1];
    return !!flow[prevKey];
  }
}

export const integrationService = new IntegrationService();
