'use server';

import { workflowService } from '../services/workflow-service';
import { executionService } from '../services/execution-service';
import { successResponse, errorResponse } from '@/lib/action-response';
import type { ActionResponse } from '@/lib/action-response';

export async function listWorkflows(): Promise<ActionResponse> {
  try {
    const data = await workflowService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function getWorkflow(id: string): Promise<ActionResponse> {
  try {
    const data = await workflowService.get(id);
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createWorkflow(input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await workflowService.create(input as Parameters<typeof workflowService.create>[0]);
    return successResponse(data, 'Workflow criado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function updateWorkflow(id: string, input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await workflowService.update(id, input as Parameters<typeof workflowService.update>[1]);
    return successResponse(data, 'Workflow atualizado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deleteWorkflow(id: string): Promise<ActionResponse> {
  try {
    await workflowService.delete(id);
    return successResponse(null, 'Workflow removido com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function executeWorkflow(workflowId: string, payload: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await executionService.executeWorkflow(workflowId, payload);
    return successResponse(data, 'Workflow executado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function listExecutions(): Promise<ActionResponse> {
  try {
    const data = await executionService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}
