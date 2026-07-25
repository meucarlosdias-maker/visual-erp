'use server';

import { webhookService } from '../services/webhook-service';
import { successResponse, errorResponse } from '@/lib/action-response';
import type { ApiResponse } from '../types';

export async function listWebhooks(): Promise<ApiResponse> {
  try {
    const data = await webhookService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function getWebhook(id: string): Promise<ApiResponse> {
  try {
    const data = await webhookService.get(id);
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createWebhook(input: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const data = await webhookService.create(input as Parameters<typeof webhookService.create>[0]);
    return successResponse(data, 'Webhook criado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function updateWebhook(id: string, input: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const data = await webhookService.update(id, input as Parameters<typeof webhookService.update>[1]);
    return successResponse(data, 'Webhook atualizado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deleteWebhook(id: string): Promise<ApiResponse> {
  try {
    await webhookService.delete(id);
    return successResponse(null, 'Webhook removido com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function testWebhook(id: string): Promise<ApiResponse> {
  try {
    const ok = await webhookService.test(id);
    return ok
      ? successResponse(null, 'Webhook testado com sucesso')
      : errorResponse('Falha ao testar webhook');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function regenerateWebhookSecret(id: string): Promise<ApiResponse> {
  try {
    const secret = await webhookService.regenerateSecret(id);
    return successResponse({ secret }, 'Secret regenerado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}