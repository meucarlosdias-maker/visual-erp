import type { EmbeddingConfig, EmbeddingResult } from '../types';

export async function generateEmbedding(
  _text: string,
  _config: EmbeddingConfig,
): Promise<EmbeddingResult> {
  throw new Error(
    'Embeddings não implementados. Configure um provedor de embeddings para ativar esta funcionalidade.',
  );
}

export async function generateEmbeddings(
  _texts: string[],
  _config: EmbeddingConfig,
): Promise<EmbeddingResult[]> {
  throw new Error(
    'Embeddings não implementados. Configure um provedor de embeddings para ativar esta funcionalidade.',
  );
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getDefaultEmbeddingConfig(): EmbeddingConfig {
  return {
    provider: 'openai',
    model: 'text-embedding-3-small',
    dimensions: 1536,
  };
}
