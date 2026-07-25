import type { EmbeddingResult, KnowledgeBaseEntry } from '../types';

export async function generateEmbedding(_text: string, _model?: string): Promise<EmbeddingResult> {
  throw new Error('Embeddings não implementados nesta versão. Consulte a documentação para configuração.');
}

export function cosineSimilarity(_a: number[], _b: number[]): number {
  throw new Error('Embeddings não implementados nesta versão. Consulte a documentação para configuração.');
}

const knowledgeBase: Map<string, KnowledgeBaseEntry[]> = new Map();

export function addToKnowledgeBase(scope: string, entry: Omit<KnowledgeBaseEntry, 'id'>): KnowledgeBaseEntry {
  const existing = knowledgeBase.get(scope) ?? [];
  const newEntry: KnowledgeBaseEntry = { id: crypto.randomUUID(), ...entry };
  existing.push(newEntry);
  knowledgeBase.set(scope, existing);
  return newEntry;
}

export function searchKnowledgeBase(scope: string, _query: string): KnowledgeBaseEntry[] {
  return knowledgeBase.get(scope) ?? [];
}

export function clearKnowledgeBase(scope: string): void {
  knowledgeBase.delete(scope);
}
