import { getTriggerDefinitions, getTriggerDefinition, getTriggersByCategory } from '@/core/workflow';
import type { TriggerDefinition, WorkflowTriggerType } from '@/core/workflow';

export class TriggerService {
  list(): TriggerDefinition[] {
    return getTriggerDefinitions();
  }

  get(type: WorkflowTriggerType): TriggerDefinition {
    return getTriggerDefinition(type);
  }

  listByCategory(category: string): TriggerDefinition[] {
    return getTriggersByCategory(category);
  }
}

export const triggerService = new TriggerService();
