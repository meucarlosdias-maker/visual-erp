import type { AIToolDefinition, AIToolType } from '../types';

const toolDefinitions: Record<AIToolType, AIToolDefinition> = {
  search_clients: {
    type: 'search_clients',
    name: 'Pesquisar Clientes',
    description: 'Pesquisa clientes na base de dados por nome, documento ou cidade',
    parameters: [
      { key: 'query', label: 'Termo de busca', type: 'string', required: true },
      { key: 'limit', label: 'Limite de resultados', type: 'number', required: false },
    ],
  },
  search_projects: {
    type: 'search_projects',
    name: 'Pesquisar Projetos',
    description: 'Pesquisa projetos por nome, status ou cliente',
    parameters: [
      { key: 'query', label: 'Termo de busca', type: 'string', required: true },
      { key: 'status', label: 'Filtrar por status', type: 'string', required: false },
    ],
  },
  search_financial: {
    type: 'search_financial',
    name: 'Pesquisar Financeiro',
    description: 'Pesquisa lançamentos financeiros por período ou tipo',
    parameters: [
      { key: 'startDate', label: 'Data inicial', type: 'string', required: false },
      { key: 'endDate', label: 'Data final', type: 'string', required: false },
      { key: 'type', label: 'Tipo (receber/pagar)', type: 'string', required: false },
    ],
  },
  search_crm: {
    type: 'search_crm',
    name: 'Pesquisar CRM',
    description: 'Pesquisa leads e oportunidades no CRM',
    parameters: [
      { key: 'query', label: 'Termo de busca', type: 'string', required: true },
      { key: 'status', label: 'Filtrar por status', type: 'string', required: false },
    ],
  },
  search_workorders: {
    type: 'search_workorders',
    name: 'Pesquisar Ordens de Serviço',
    description: 'Pesquisa ordens de serviço por número, cliente ou status',
    parameters: [
      { key: 'query', label: 'Termo de busca', type: 'string', required: true },
      { key: 'status', label: 'Filtrar por status', type: 'string', required: false },
    ],
  },
  generate_report: {
    type: 'generate_report',
    name: 'Gerar Relatório',
    description: 'Gera um relatório estruturado com base nos dados fornecidos',
    parameters: [
      { key: 'title', label: 'Título do relatório', type: 'string', required: true },
      { key: 'data', label: 'Dados para o relatório', type: 'string', required: true },
      { key: 'format', label: 'Formato (resumo/detalhado)', type: 'string', required: false },
    ],
  },
  generate_summary: {
    type: 'generate_summary',
    name: 'Gerar Resumo',
    description: 'Gera um resumo conciso do conteúdo fornecido',
    parameters: [
      { key: 'content', label: 'Conteúdo a resumir', type: 'string', required: true },
      { key: 'maxLength', label: 'Tamanho máximo do resumo', type: 'number', required: false },
    ],
  },
  generate_email: {
    type: 'generate_email',
    name: 'Gerar E-mail',
    description: 'Gera um e-mail profissional com base nas instruções',
    parameters: [
      { key: 'to', label: 'Destinatário', type: 'string', required: true },
      { key: 'subject', label: 'Assunto', type: 'string', required: true },
      { key: 'context', label: 'Contexto da mensagem', type: 'string', required: true },
      { key: 'tone', label: 'Tom (formal/informal)', type: 'string', required: false },
    ],
  },
};

export function getToolDefinitions(): AIToolDefinition[] {
  return Object.values(toolDefinitions);
}

export function getToolDefinition(type: AIToolType): AIToolDefinition {
  const tool = toolDefinitions[type];
  if (!tool) throw new Error(`Ferramenta não encontrada: ${type}`);
  return tool;
}

export function getToolsByNames(names: string[]): AIToolDefinition[] {
  return names
    .map((name) => toolDefinitions[name as AIToolType])
    .filter((t): t is AIToolDefinition => t != null);
}
