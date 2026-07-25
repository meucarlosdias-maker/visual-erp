'use server';

import { collectionService } from '../services/collection-service';
import { documentService } from '../services/document-service';
import { successResponse, errorResponse } from '@/lib/action-response';
import type { ActionResponse } from '@/lib/action-response';

export async function listCollections(): Promise<ActionResponse> {
  try {
    const data = await collectionService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createCollection(input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await collectionService.create(input as Parameters<typeof collectionService.create>[0]);
    return successResponse(data, 'Coleção criada com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deleteCollection(id: string): Promise<ActionResponse> {
  try {
    await collectionService.delete(id);
    return successResponse(null, 'Coleção removida com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function listDocuments(): Promise<ActionResponse> {
  try {
    const data = await documentService.list();
    return successResponse(data);
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function createDocument(input: Record<string, unknown>): Promise<ActionResponse> {
  try {
    const data = await documentService.create(input as Parameters<typeof documentService.create>[0]);
    return successResponse(data, 'Documento criado com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}

export async function deleteDocument(id: string): Promise<ActionResponse> {
  try {
    await documentService.delete(id);
    return successResponse(null, 'Documento removido com sucesso');
  } catch (err) {
    return errorResponse((err as Error).message);
  }
}
