export const PERIOD_LABELS: Record<string, string> = {
  today: 'Hoje',
  week: 'Esta Semana',
  month: 'Este Mês',
  quarter: 'Este Trimestre',
  year: 'Este Ano',
  custom: 'Personalizado',
};

export const WIDGET_TYPE_LABELS: Record<string, string> = {
  stat: 'Indicador',
  metric: 'Métrica',
  progress: 'Progresso',
  line_chart: 'Gráfico de Linha',
  bar_chart: 'Gráfico de Barras',
  area_chart: 'Gráfico de Área',
  pie_chart: 'Gráfico de Pizza',
  funnel_chart: 'Funil',
  table: 'Tabela',
};

export const WIDGET_MODULE_LABELS: Record<string, string> = {
  commercial: 'Comercial',
  production: 'Produção',
  financial: 'Financeiro',
  operation: 'Operação',
  general: 'Geral',
};

export const MODULE_ORDER = ['commercial', 'production', 'financial', 'operation', 'general'] as const;

export const DEFAULT_WIDGETS = [
  { id: 'w-commercial-leads', name: 'Leads do Mês', type: 'stat', module: 'commercial', position: 0, width: 'half', height: 'short', active: true },
  { id: 'w-commercial-conversion', name: 'Taxa de Conversão', type: 'metric', module: 'commercial', position: 1, width: 'half', height: 'short', active: true },
  { id: 'w-commercial-visits', name: 'Visitas Agendadas', type: 'stat', module: 'commercial', position: 2, width: 'half', height: 'short', active: true },
  { id: 'w-commercial-quotations', name: 'Orçamentos', type: 'metric', module: 'commercial', position: 3, width: 'half', height: 'short', active: true },
  { id: 'w-commercial-ticket', name: 'Ticket Médio', type: 'metric', module: 'commercial', position: 4, width: 'half', height: 'short', active: true },
  { id: 'w-production-projects', name: 'Projetos em Produção', type: 'stat', module: 'production', position: 5, width: 'half', height: 'short', active: true },
  { id: 'w-production-delayed', name: 'Ordens Atrasadas', type: 'stat', module: 'production', position: 6, width: 'half', height: 'short', active: true },
  { id: 'w-production-time', name: 'Tempo Médio', type: 'metric', module: 'production', position: 7, width: 'half', height: 'short', active: true },
  { id: 'w-production-installations', name: 'Inst. Pendentes', type: 'stat', module: 'production', position: 8, width: 'half', height: 'short', active: true },
  { id: 'w-financial-revenue', name: 'Receita do Mês', type: 'metric', module: 'financial', position: 9, width: 'half', height: 'short', active: true },
  { id: 'w-financial-expenses', name: 'Despesas do Mês', type: 'stat', module: 'financial', position: 10, width: 'half', height: 'short', active: true },
  { id: 'w-financial-cashflow', name: 'Fluxo de Caixa', type: 'stat', module: 'financial', position: 11, width: 'half', height: 'short', active: true },
  { id: 'w-financial-profit', name: 'Lucro', type: 'metric', module: 'financial', position: 12, width: 'half', height: 'short', active: true },
  { id: 'w-financial-receivable', name: 'Contas a Receber', type: 'stat', module: 'financial', position: 13, width: 'half', height: 'short', active: true },
  { id: 'w-financial-payable', name: 'Contas a Pagar', type: 'stat', module: 'financial', position: 14, width: 'half', height: 'short', active: true },
  { id: 'w-operation-projects', name: 'Projetos Ativos', type: 'stat', module: 'operation', position: 15, width: 'half', height: 'short', active: true },
  { id: 'w-operation-os', name: 'OS em Aberto', type: 'stat', module: 'operation', position: 16, width: 'half', height: 'short', active: true },
  { id: 'w-operation-productions', name: 'Produções Hoje', type: 'stat', module: 'operation', position: 17, width: 'half', height: 'short', active: true },
  { id: 'w-operation-installations', name: 'Instalações Hoje', type: 'stat', module: 'operation', position: 18, width: 'half', height: 'short', active: true },
  { id: 'charts-revenue', name: 'Receita por Mês', type: 'bar_chart', module: 'financial', position: 19, width: 'half', height: 'tall', active: true },
  { id: 'charts-quotations', name: 'Orçamentos por Mês', type: 'line_chart', module: 'commercial', position: 20, width: 'half', height: 'tall', active: true },
  { id: 'charts-production-dept', name: 'Produção por Departamento', type: 'bar_chart', module: 'production', position: 21, width: 'half', height: 'tall', active: true },
  { id: 'charts-funnel', name: 'Funil Comercial', type: 'funnel_chart', module: 'commercial', position: 22, width: 'half', height: 'tall', active: true },
  { id: 'charts-financial-flow', name: 'Fluxo Financeiro', type: 'area_chart', module: 'financial', position: 23, width: 'half', height: 'tall', active: true },
  { id: 'charts-projects-status', name: 'Projetos por Status', type: 'pie_chart', module: 'production', position: 24, width: 'half', height: 'tall', active: true },
];
