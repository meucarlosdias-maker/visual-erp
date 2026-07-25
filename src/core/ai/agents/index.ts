import type { AgentDefinition, AgentType } from '../types';

const agentDefinitions: Record<AgentType, AgentDefinition> = {
  commercial: {
    type: 'commercial',
    name: 'Assistente Comercial',
    description: 'Auxilia na análise de leads, oportunidades e estratégias de vendas',
    systemPrompt: 'Você é um assistente comercial especializado em analisar leads, oportunidades e métricas de vendas.',
    tools: ['search_crm', 'search_clients', 'generate_report', 'generate_summary'],
  },
  financial: {
    type: 'financial',
    name: 'Assistente Financeiro',
    description: 'Auxilia na análise financeira, fluxo de caixa e contas',
    systemPrompt: 'Você é um assistente financeiro especializado em análise de dados financeiros e relatórios.',
    tools: ['search_financial', 'search_clients', 'generate_report', 'generate_summary'],
  },
  production: {
    type: 'production',
    name: 'Assistente de Produção',
    description: 'Auxilia no acompanhamento de ordens de produção e eficiência',
    systemPrompt: 'Você é um assistente de produção especializado em otimização de processos produtivos.',
    tools: ['search_workorders', 'search_projects', 'generate_report'],
  },
  project: {
    type: 'project',
    name: 'Assistente de Projetos',
    description: 'Auxilia no gerenciamento de projetos e cronogramas',
    systemPrompt: 'Você é um assistente de projetos especializado em gestão de cronogramas e recursos.',
    tools: ['search_projects', 'search_clients', 'generate_report', 'generate_summary'],
  },
  support: {
    type: 'support',
    name: 'Assistente de Atendimento',
    description: 'Auxilia no atendimento ao cliente e suporte',
    systemPrompt: 'Você é um assistente de atendimento especializado em suporte ao cliente.',
    tools: ['search_clients', 'search_crm', 'generate_email', 'generate_summary'],
  },
  executive: {
    type: 'executive',
    name: 'Assistente Executivo',
    description: 'Auxilia na visão geral do negócio e tomada de decisões',
    systemPrompt: 'Você é um assistente executivo especializado em análise estratégica do negócio.',
    tools: ['search_clients', 'search_projects', 'search_financial', 'search_crm', 'generate_report', 'generate_summary'],
  },
};

export function getAgentDefinitions(): AgentDefinition[] {
  return Object.values(agentDefinitions);
}

export function getAgentDefinition(type: AgentType): AgentDefinition {
  const agent = agentDefinitions[type];
  if (!agent) throw new Error(`Agente não encontrado: ${type}`);
  return agent;
}
