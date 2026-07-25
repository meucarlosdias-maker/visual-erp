'use server';

import { apiKeyService } from '../services/api-key-service';
import { successResponse, errorResponse } from '@/lib/action-response';
import type { ApiResponse } from '../types';

export async function listApiKeys(): Promise<ApiResponse> {
  try {
    const data = await apiKeyService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function getApiKey(id: string): Promise<ApiResponse> {
  try {
    const data = await apiKeyService.get(id);
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createApiKey(input: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const data = await apiKeyService.create(input as Parameters<typeof apiKeyService.create>[0]);
    return successResponse(data, 'Chave de API criada com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function updateApiKey(id: string, input: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const data = await apiKeyService.update(id, input as Parameters<typeof apiKeyService.update>[1]);
    return successResponse(data, 'Chave de API atualizada com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deleteApiKey(id: string): Promise<ApiResponse> {
  try {
    await apiKeyService.delete(id);
    return successResponse(null, 'Chave de API removida com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function regenerateApiKeySecret(id: string): Promise<ApiResponse> {
  try {
    const secret = await apiKeyService.regenerateSecret(id);
    return successResponse({ secret }, 'Secret regenerado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}