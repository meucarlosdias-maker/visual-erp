export const SYSTEM_MODULES = [
  'clientes', 'crm', 'projetos', 'producao',
  'instalacao', 'financeiro', 'agenda', 'configuracoes',
  'administracao',
] as const;

export const SYSTEM_ACTIONS = [
  'view', 'create', 'edit', 'delete',
  'approve', 'export', 'configure',
] as const;

export const MODULE_LABELS: Record<string, string> = {
  clientes: 'Clientes',
  crm: 'CRM',
  projetos: 'Projetos',
  producao: 'Produção',
  instalacao: 'Instalação',
  financeiro: 'Financeiro',
  agenda: 'Agenda',
  configuracoes: 'Configurações',
  administracao: 'Administração',
};

export const ACTION_LABELS: Record<string, string> = {
  view: 'Visualizar',
  create: 'Criar',
  edit: 'Editar',
  delete: 'Excluir',
  approve: 'Aprovar',
  export: 'Exportar',
  configure: 'Configurar',
};

export const ADMIN_PERMISSIONS = [
  'admin.view',
  'admin.roles',
  'admin.permissions',
  'admin.audit',
  'admin.logs',
  'admin.security',
] as const;

export const ADMIN_PERMISSION_LABELS: Record<string, string> = {
  'admin.view': 'Visualizar Administração',
  'admin.roles': 'Gerenciar Papéis',
  'admin.permissions': 'Gerenciar Permissões',
  'admin.audit': 'Visualizar Auditoria',
  'admin.logs': 'Visualizar Logs',
  'admin.security': 'Configurar Segurança',
};

export const LOG_LEVEL_LABELS: Record<string, string> = {
  DEBUG: 'Debug',
  INFO: 'Informação',
  WARN: 'Aviso',
  ERROR: 'Erro',
  FATAL: 'Fatal',
};

export const LOG_LEVEL_COLORS: Record<string, string> = {
  DEBUG: 'bg-gray-100 text-gray-700',
  INFO: 'bg-blue-100 text-blue-700',
  WARN: 'bg-yellow-100 text-yellow-700',
  ERROR: 'bg-red-100 text-red-700',
  FATAL: 'bg-purple-100 text-purple-700',
};

export const AUTH_MODULES = SYSTEM_MODULES;
