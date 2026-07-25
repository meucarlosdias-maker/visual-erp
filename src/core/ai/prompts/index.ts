import type { AIPromptDefinition } from '../types';

const defaultPrompts: AIPromptDefinition[] = [
  {
    id: 'prompt-crm-001',
    name: 'Análise de Lead',
    module: 'CRM',
    version: 1,
    prompt: 'Analise o seguinte lead e sugira próximas ações: {{leadData}}',
    systemPrompt: 'Você é um assistente de CRM especializado em análise de leads. Forneça recomendações práticas.',
    active: true,
  },
  {
    id: 'prompt-financeiro-001',
    name: 'Análise Financeira',
    module: 'Financeiro',
    version: 1,
    prompt: 'Analise os seguintes dados financeiros: {{financialData}}',
    systemPrompt: 'Você é um assistente financeiro. Analise dados e forneça insights sobre fluxo de caixa.',
    active: true,
  },
  {
    id: 'prompt-producao-001',
    name: 'Análise de Produção',
    module: 'Produção',
    version: 1,
    prompt: 'Analise o status da produção: {{productionData}}',
    systemPrompt: 'Você é um assistente de produção. Analise ordens de produção e sugira otimizações.',
    active: true,
  },
  {
    id: 'prompt-comercial-001',
    name: 'Análise Comercial',
    module: 'Comercial',
    version: 1,
    prompt: 'Analise os dados comerciais: {{commercialData}}',
    systemPrompt: 'Você é um assistente comercial. Analise oportunidades e sugira estratégias de vendas.',
    active: true,
  },
  {
    id: 'prompt-atendimento-001',
    name: 'Resposta de Atendimento',
    module: 'Atendimento',
    version: 1,
    prompt: 'Ajude a responder: {{supportTicket}}',
    systemPrompt: 'Você é um assistente de atendimento. Responda de forma cordial e objetiva.',
    active: true,
  },
  {
    id: 'prompt-projetos-001',
    name: 'Análise de Projeto',
    module: 'Projetos',
    version: 1,
    prompt: 'Analise o progresso do projeto: {{projectData}}',
    systemPrompt: 'Você é um assistente de projetos. Analise cronogramas e riscos.',
    active: true,
  },
];

export function getDefaultPrompts(): AIPromptDefinition[] {
  return defaultPrompts;
}

export function getDefaultPrompt(module: string): AIPromptDefinition | undefined {
  return defaultPrompts.find((p) => p.module === module && p.active);
}

export function getDefaultPromptById(id: string): AIPromptDefinition | undefined {
  return defaultPrompts.find((p) => p.id === id);
}
