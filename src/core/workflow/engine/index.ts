import type { WorkflowDefinition, WorkflowContext, ExecutionResult } from '../types';
import { executeStepAction, shouldExecuteStep } from '../executors';

export interface WorkflowRunResult {
  context: WorkflowContext;
  steps: ExecutionResult[];
  totalDurationMs: number;
  success: boolean;
  error?: string;
}

export function createContext(
  workflow: WorkflowDefinition,
  payload: Record<string, unknown>,
): WorkflowContext {
  return {
    workflowId: workflow.id,
    companyId: workflow.companyId,
    trigger: workflow.trigger,
    payload,
    startedAt: new Date(),
  };
}

export async function runWorkflow(
  workflow: WorkflowDefinition,
  payload: Record<string, unknown>,
): Promise<WorkflowRunResult> {
  const context = createContext(workflow, payload);
  const stepResults: ExecutionResult[] = [];
  const workflowStart = performance.now();

  for (const step of workflow.steps) {
    if (!shouldExecuteStep(step.conditions, payload)) {
      stepResults.push({
        stepId: step.id,
        stepOrder: step.order,
        actionType: step.actionType,
        status: 'skipped',
        message: 'Condições não atendidas',
        durationMs: 0,
      });
      continue;
    }

    try {
      const result = executeStepAction(context, step);
      stepResults.push(result);

      if (result.status === 'failed') {
        return {
          context,
          steps: stepResults,
          totalDurationMs: Math.round(performance.now() - workflowStart),
          success: false,
          error: result.error ?? result.message,
        };
      }
    } catch (err) {
      stepResults.push({
        stepId: step.id,
        stepOrder: step.order,
        actionType: step.actionType,
        status: 'failed',
        message: (err as Error).message,
        durationMs: Math.round(performance.now() - workflowStart),
        error: (err as Error).message,
      });

      return {
        context,
        steps: stepResults,
        totalDurationMs: Math.round(performance.now() - workflowStart),
        success: false,
        error: (err as Error).message,
      };
    }
  }

  return {
    context,
    steps: stepResults,
    totalDurationMs: Math.round(performance.now() - workflowStart),
    success: true,
  };
}
