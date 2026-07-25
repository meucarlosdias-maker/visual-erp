import type { TriggerDefinition, WorkflowTriggerType } from '../types';

const triggerDefinitions: Record<WorkflowTriggerType, TriggerDefinition> = {
  CLIENT_CREATED: {
    type: 'CLIENT_CREATED',
    label: 'Cliente criado',
    description: 'Dispara quando um novo cliente é cadastrado',
    category: 'clientes',
  },
  LEAD_CREATED: {
    type: 'LEAD_CREATED',
    label: 'Lead criado',
    description: 'Dispara quando um novo lead é registrado',
    category: 'comercial',
  },
  LEAD_CONVERTED: {
    type: 'LEAD_CONVERTED',
    label: 'Lead convertido',
    description: 'Dispara quando um lead é convertido em cliente',
    category: 'comercial',
  },
  QUOTE_APPROVED: {
    type: 'QUOTE_APPROVED',
    label: 'Orçamento aprovado',
    description: 'Dispara quando um orçamento é aprovado',
    category: 'comercial',
  },
  PROJECT_CREATED: {
    type: 'PROJECT_CREATED',
    label: 'Projeto criado',
    description: 'Dispara quando um novo projeto é criado',
    category: 'projetos',
  },
  WORKORDER_CREATED: {
    type: 'WORKORDER_CREATED',
    label: 'OS criada',
    description: 'Dispara quando uma ordem de serviço é criada',
    category: 'producao',
  },
  PRODUCTION_FINISHED: {
    type: 'PRODUCTION_FINISHED',
    label: 'Produção concluída',
    description: 'Dispara quando uma produção é concluída',
    category: 'producao',
  },
  INSTALLATION_FINISHED: {
    type: 'INSTALLATION_FINISHED',
    label: 'Instalação concluída',
    description: 'Dispara quando uma instalação é concluída',
    category: 'instalacao',
  },
  FINANCIAL_RECEIVED: {
    type: 'FINANCIAL_RECEIVED',
    label: 'Conta recebida',
    description: 'Dispara quando uma conta é recebida',
    category: 'financeiro',
  },
  FINANCIAL_PAID: {
    type: 'FINANCIAL_PAID',
    label: 'Conta paga',
    description: 'Dispara quando uma conta é paga',
    category: 'financeiro',
  },
  USER_CREATED: {
    type: 'USER_CREATED',
    label: 'Usuário criado',
    description: 'Dispara quando um novo usuário é cadastrado',
    category: 'usuarios',
  },
};

export function getTriggerDefinitions(): TriggerDefinition[] {
  return Object.values(triggerDefinitions);
}

export function getTriggerDefinition(type: WorkflowTriggerType): TriggerDefinition {
  const def = triggerDefinitions[type];
  if (!def) {
    throw new Error(`Trigger não encontrado: ${type}`);
  }
  return def;
}

export function getTriggersByCategory(category: string): TriggerDefinition[] {
  return Object.values(triggerDefinitions).filter((t) => t.category === category);
}
