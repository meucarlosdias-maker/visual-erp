'use server';

import { providerService } from '../services/provider-service';
import { promptService } from '../services/prompt-service';
import { aiExecutionService } from '../services/execution-service';
import { successResponse, errorResponse } from '@/lib/action-response';
import type { ActionResponse } from '@/lib/action-response';

export async function listProviders(): Promise<ActionResponse> {
  try {
    const data = await providerService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createProvider(input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await providerService.create(input as Parameters<typeof providerService.create>[0]);
    return successResponse(data, 'Provedor criado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function updateProvider(id: string, input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await providerService.update(id, input as Parameters<typeof providerService.update>[1]);
    return successResponse(data, 'Provedor atualizado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deleteProvider(id: string): Promise<ActionResponse> {
  try {
    await providerService.delete(id);
    return successResponse(null, 'Provedor removido com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function listPrompts(): Promise<ActionResponse> {
  try {
    const data = await promptService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createPrompt(input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await promptService.create(input as Parameters<typeof promptService.create>[0]);
    return successResponse(data, 'Prompt criado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deletePrompt(id: string): Promise<ActionResponse> {
  try {
    await promptService.delete(id);
    return successResponse(null, 'Prompt removido com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function listAiExecutions(): Promise<ActionResponse> {
  try {
    const data = await aiExecutionService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}
