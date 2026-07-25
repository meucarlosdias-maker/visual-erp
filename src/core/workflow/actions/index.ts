import type { ActionDefinition, ActionType, ActionConfigField } from '../types';

const actionDefinitions: Record<ActionType, ActionDefinition> = {
  create_record: {
    type: 'create_record',
    label: 'Criar registro',
    description: 'Cria um novo registro em qualquer entidade',
    category: 'dados',
    configFields: [
      { key: 'entity', label: 'Entidade', type: 'select', required: true, options: ['client', 'project', 'task', 'event'] },
      { key: 'data', label: 'Dados do registro', type: 'json', required: true },
    ],
  },
  update_record: {
    type: 'update_record',
    label: 'Atualizar registro',
    description: 'Atualiza um registro existente',
    category: 'dados',
    configFields: [
      { key: 'entity', label: 'Entidade', type: 'select', required: true, options: ['client', 'project', 'task', 'event'] },
      { key: 'recordId', label: 'ID do registro', type: 'string', required: true },
      { key: 'data', label: 'Dados para atualização', type: 'json', required: true },
    ],
  },
  change_status: {
    type: 'change_status',
    label: 'Alterar status',
    description: 'Altera o status de uma entidade',
    category: 'dados',
    configFields: [
      { key: 'entity', label: 'Entidade', type: 'select', required: true, options: ['project', 'workorder', 'production', 'installation'] },
      { key: 'status', label: 'Novo status', type: 'string', required: true },
    ],
  },
  create_task: {
    type: 'create_task',
    label: 'Criar tarefa',
    description: 'Cria uma nova tarefa para um usuário ou equipe',
    category: 'tarefas',
    configFields: [
      { key: 'title', label: 'Título', type: 'string', required: true },
      { key: 'description', label: 'Descrição', type: 'string', required: false },
      { key: 'assignedUserId', label: 'Responsável', type: 'string', required: false },
      { key: 'dueDate', label: 'Data limite', type: 'string', required: false },
    ],
  },
  create_event: {
    type: 'create_event',
    label: 'Criar evento',
    description: 'Cria um evento na agenda',
    category: 'agenda',
    configFields: [
      { key: 'title', label: 'Título', type: 'string', required: true },
      { key: 'description', label: 'Descrição', type: 'string', required: false },
      { key: 'date', label: 'Data', type: 'string', required: true },
      { key: 'duration', label: 'Duração (minutos)', type: 'number', required: false },
    ],
  },
  send_notification: {
    type: 'send_notification',
    label: 'Enviar notificação',
    description: 'Envia uma notificação para usuários (estrutura preparada)',
    category: 'comunicacao',
    configFields: [
      { key: 'title', label: 'Título', type: 'string', required: true },
      { key: 'message', label: 'Mensagem', type: 'string', required: true },
      { key: 'userId', label: 'Usuário destino', type: 'string', required: false },
      { key: 'type', label: 'Tipo', type: 'select', required: true, options: ['info', 'warning', 'success', 'error'] },
    ],
  },
  execute_webhook: {
    type: 'execute_webhook',
    label: 'Executar webhook',
    description: 'Dispara uma requisição HTTP para uma URL externa (estrutura preparada)',
    category: 'integracao',
    configFields: [
      { key: 'url', label: 'URL do webhook', type: 'string', required: true },
      { key: 'method', label: 'Método HTTP', type: 'select', required: true, options: ['GET', 'POST', 'PUT', 'PATCH'] },
      { key: 'headers', label: 'Headers personalizados', type: 'json', required: false },
    ],
  },
  log_entry: {
    type: 'log_entry',
    label: 'Registrar log',
    description: 'Registra uma entrada no log de auditoria',
    category: 'auditoria',
    configFields: [
      { key: 'message', label: 'Mensagem', type: 'string', required: true },
      { key: 'level', label: 'Nível', type: 'select', required: true, options: ['info', 'warning', 'error'] },
    ],
  },
};

export function getActionDefinitions(): ActionDefinition[] {
  return Object.values(actionDefinitions);
}

export function getActionDefinition(type: ActionType): ActionDefinition {
  const def = actionDefinitions[type];
  if (!def) {
    throw new Error(`Ação não encontrada: ${type}`);
  }
  return def;
}

export function getActionsByCategory(category: string): ActionDefinition[] {
  return Object.values(actionDefinitions).filter((a) => a.category === category);
}
