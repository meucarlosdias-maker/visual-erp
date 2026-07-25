export type WorkflowTriggerType =
  | 'CLIENT_CREATED' | 'LEAD_CREATED' | 'LEAD_CONVERTED'
  | 'QUOTE_APPROVED' | 'PROJECT_CREATED' | 'WORKORDER_CREATED'
  | 'PRODUCTION_FINISHED' | 'INSTALLATION_FINISHED'
  | 'FINANCIAL_RECEIVED' | 'FINANCIAL_PAID' | 'USER_CREATED';

export interface TriggerDefinition {
  type: WorkflowTriggerType;
  label: string;
  description: string;
  category: string;
}

export type ConditionOperator =
  | 'equals' | 'not_equals' | 'greater_than' | 'less_than'
  | 'contains' | 'date_equals' | 'date_before' | 'date_after'
  | 'status_equals' | 'user_equals' | 'company_equals';

export interface ConditionDefinition {
  operator: ConditionOperator;
  label: string;
  description: string;
  valueType: 'string' | 'number' | 'date' | 'boolean' | 'select';
  options?: string[];
}

export interface ConditionConfig {
  field: string;
  operator: ConditionOperator;
  value: unknown;
}

export type ActionType =
  | 'create_record' | 'update_record' | 'change_status'
  | 'create_task' | 'create_event' | 'send_notification'
  | 'execute_webhook' | 'log_entry';

export interface ActionDefinition {
  type: ActionType;
  label: string;
  description: string;
  category: string;
  configFields: ActionConfigField[];
}

export interface ActionConfigField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json';
  required: boolean;
  options?: string[];
}

export interface StepConfig {
  conditions: ConditionConfig[];
  actionType: ActionType;
  actionConfig: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  companyId: string;
  name: string;
  description: string;
  active: boolean;
  trigger: WorkflowTriggerType;
  steps: WorkflowStepDefinition[];
}

export interface WorkflowStepDefinition {
  id: string;
  order: number;
  conditions: ConditionConfig[];
  actionType: ActionType;
  actionConfig: Record<string, unknown>;
}

export interface ExecutionResult {
  stepId: string;
  stepOrder: number;
  actionType: ActionType;
  status: 'completed' | 'failed' | 'skipped';
  message: string;
  durationMs: number;
  error?: string;
}

export interface WorkflowContext {
  workflowId: string;
  companyId: string;
  trigger: WorkflowTriggerType;
  payload: Record<string, unknown>;
  startedAt: Date;
}

export type WorkflowExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
