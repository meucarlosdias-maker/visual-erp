export const WORKING_DAYS_LABELS: Record<number, string> = {
  0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta',
  4: 'Quinta', 5: 'Sexta', 6: 'Sábado',
};

export const SEQUENCE_ENTITIES = [
  'project', 'quotation', 'work_order', 'invoice',
  'client', 'supplier', 'product', 'service',
] as const;

export const SEQUENCE_ENTITY_LABELS: Record<string, string> = {
  project: 'Projetos',
  quotation: 'Orçamentos',
  work_order: 'Ordens de Serviço',
  invoice: 'Notas Fiscais',
  client: 'Clientes',
  supplier: 'Fornecedores',
  product: 'Produtos',
  service: 'Serviços',
};

export const CURRENCY_OPTIONS = [
  { value: 'BRL', label: 'R$ - Real' },
  { value: 'USD', label: '$ - Dólar' },
  { value: 'EUR', label: '€ - Euro' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es', label: 'Español' },
];

export const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'Brasília (UTC-3)' },
  { value: 'America/Manaus', label: 'Manaus (UTC-4)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (UTC-3)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' },
];
