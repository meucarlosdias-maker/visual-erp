import { getActionDefinitions, getActionDefinition, getActionsByCategory } from '@/core/workflow';
import type { ActionDefinition, ActionType } from '@/core/workflow';

export class ActionService {
  list(): ActionDefinition[] {
    return getActionDefinitions();
  }

  get(type: ActionType): ActionDefinition {
    return getActionDefinition(type);
  }

  listByCategory(category: string): ActionDefinition[] {
    return getActionsByCategory(category);
  }
}

export const actionService = new ActionService();
