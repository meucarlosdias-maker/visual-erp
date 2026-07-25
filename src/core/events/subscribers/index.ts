import { eventBus } from '../bus';
import type { InternalEvent, EventHandler, EventPayload } from '../types';

export function subscribe(
  event: InternalEvent,
  handler: EventHandler,
): () => void {
  return eventBus.on(event, handler);
}

export function subscribeMany(
  events: InternalEvent[],
  handler: EventHandler,
): () => void {
  const unsubs = events.map((e) => eventBus.on(e, handler));
  return () => { unsubs.forEach((u) => u()); };
}

export function subscribeAll(
  handler: (payload: EventPayload) => void,
): () => void {
  const allEvents: InternalEvent[] = [
    'UserCreated', 'ClientCreated', 'LeadConverted',
    'QuoteApproved', 'ProjectCreated', 'ProjectFinished',
    'WorkOrderCreated', 'ProductionFinished', 'InstallationFinished',
    'FinancialPaid', 'FinancialReceived', 'WorkflowExecuted',
    'AIExecutionFinished',
  ];
  return subscribeMany(allEvents, handler);
}
