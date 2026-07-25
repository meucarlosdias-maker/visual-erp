import type { WorkflowTriggerType } from '@/core/workflow/types';
import type { WorkflowExecutionStatus } from '@/core/workflow/types';

export interface Workflow {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  active: boolean;
  trigger: WorkflowTriggerType;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface WorkflowStep {
  id: string;
  workflowId: string;
  order: number;
  type: string;
  configuration: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  startedAt: Date | null;
  finishedAt: Date | null;
  duration: number | null;
  error: string | null;
  logs: WorkflowExecutionLog[];
}

export interface WorkflowExecutionLog {
  id: string;
  executionId: string;
  step: string;
  status: string;
  message: string | null;
  createdAt: Date;
}

export { WorkflowTriggerType, WorkflowExecutionStatus };
