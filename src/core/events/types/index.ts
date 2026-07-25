export type InternalEvent =
  | 'UserCreated'
  | 'ClientCreated'
  | 'LeadConverted'
  | 'QuoteApproved'
  | 'ProjectCreated'
  | 'ProjectFinished'
  | 'WorkOrderCreated'
  | 'ProductionFinished'
  | 'InstallationFinished'
  | 'FinancialPaid'
  | 'FinancialReceived'
  | 'WorkflowExecuted'
  | 'AIExecutionFinished';

export interface EventPayload {
  event: InternalEvent;
  companyId: string;
  data: Record<string, unknown>;
  timestamp: Date;
  publisher: string;
}

export interface EventHandler {
  (payload: EventPayload): Promise<void> | void;
}

export interface EventBusConfig {
  maxListeners?: number;
  captureErrors?: boolean;
}

export const EVENT_BUS_DEFAULTS: EventBusConfig = {
  maxListeners: 100,
  captureErrors: true,
};
