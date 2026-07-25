import { getTriggerDefinitions, getTriggerDefinition } from '../triggers';
import { getConditionDefinitions, getConditionDefinition, resolveCondition } from '../conditions';
import { getActionDefinitions, getActionDefinition } from '../actions';
import type { TriggerDefinition, ConditionDefinition, ActionDefinition, ConditionConfig, WorkflowTriggerType, ConditionOperator, ActionType } from '../types';

export interface WorkflowRegistry {
  triggers: {
    getAll: () => TriggerDefinition[];
    get: (type: WorkflowTriggerType) => TriggerDefinition;
  };
  conditions: {
    getAll: () => ConditionDefinition[];
    get: (operator: ConditionOperator) => ConditionDefinition;
    resolve: (config: ConditionConfig, payload: Record<string, unknown>) => boolean;
  };
  actions: {
    getAll: () => ActionDefinition[];
    get: (type: ActionType) => ActionDefinition;
  };
}

export const workflowRegistry: WorkflowRegistry = {
  triggers: {
    getAll: getTriggerDefinitions,
    get: getTriggerDefinition,
  },
  conditions: {
    getAll: getConditionDefinitions,
    get: getConditionDefinition,
    resolve: resolveCondition,
  },
  actions: {
    getAll: getActionDefinitions,
    get: getActionDefinition,
  },
};
