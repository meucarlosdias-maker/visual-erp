import type { ActionType, ExecutionResult, WorkflowContext, WorkflowStepDefinition, ConditionConfig, StepConfig } from '../types';
import { resolveCondition } from '../conditions';

function executeCreateRecord(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const entity = String(config.entity ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'create_record',
    status: 'completed',
    message: `Registro criado em ${entity}`,
    durationMs: 0,
  };
}

function executeUpdateRecord(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const entity = String(config.entity ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'update_record',
    status: 'completed',
    message: `Registro atualizado em ${entity}`,
    durationMs: 0,
  };
}

function executeChangeStatus(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const status = String(config.status ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'change_status',
    status: 'completed',
    message: `Status alterado para ${status}`,
    durationMs: 0,
  };
}

function executeCreateTask(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const title = String(config.title ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'create_task',
    status: 'completed',
    message: `Tarefa criada: ${title}`,
    durationMs: 0,
  };
}

function executeCreateEvent(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const title = String(config.title ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'create_event',
    status: 'completed',
    message: `Evento criado: ${title}`,
    durationMs: 0,
  };
}

function executeSendNotification(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const title = String(config.title ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'send_notification',
    status: 'completed',
    message: `Notificação enviada: ${title}`,
    durationMs: 0,
  };
}

function executeWebhook(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const url = String(config.url ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'execute_webhook',
    status: 'completed',
    message: `Webhook disparado: ${url}`,
    durationMs: 0,
  };
}

function executeLogEntry(_context: WorkflowContext, config: Record<string, unknown>): ExecutionResult {
  const message = String(config.message ?? '');
  return {
    stepId: '',
    stepOrder: 0,
    actionType: 'log_entry',
    status: 'completed',
    message: `Log registrado: ${message}`,
    durationMs: 0,
  };
}

type ActionExecutor = (context: WorkflowContext, config: Record<string, unknown>) => ExecutionResult;

const executors: Record<ActionType, ActionExecutor> = {
  create_record: executeCreateRecord,
  update_record: executeUpdateRecord,
  change_status: executeChangeStatus,
  create_task: executeCreateTask,
  create_event: executeCreateEvent,
  send_notification: executeSendNotification,
  execute_webhook: executeWebhook,
  log_entry: executeLogEntry,
};

export function getExecutor(type: ActionType): ActionExecutor {
  const executor = executors[type];
  if (!executor) {
    throw new Error(`Executor não encontrado para ação: ${type}`);
  }
  return executor;
}

export function executeStepAction(context: WorkflowContext, step: WorkflowStepDefinition): ExecutionResult {
  const start = performance.now();
  const executor = getExecutor(step.actionType);
  const result = executor(context, step.actionConfig);
  const durationMs = Math.round(performance.now() - start);
  return { ...result, stepId: step.id, stepOrder: step.order, durationMs };
}

export function shouldExecuteStep(conditions: ConditionConfig[], payload: Record<string, unknown>): boolean {
  if (conditions.length === 0) return true;
  return conditions.every((condition) => resolveCondition(condition, payload));
}
