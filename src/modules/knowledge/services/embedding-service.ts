import { getKnowledgeProvider } from '@/core/knowledge/providers';
import { getDefaultEmbeddingConfig } from '@/core/knowledge/embeddings';
import type { EmbeddingProvider } from '@/core/knowledge';

export class EmbeddingService {
  getProvider(type?: EmbeddingProvider) {
    const config = getDefaultEmbeddingConfig();
    return getKnowledgeProvider(type ?? config.provider);
  }

  async generateEmbedding(text: string, provider?: EmbeddingProvider): Promise<number[]> {
    const p = this.getProvider(provider);
    return p.generateEmbedding(text);
  }

  async generateEmbeddings(texts: string[], provider?: EmbeddingProvider): Promise<number[][]> {
    const p = this.getProvider(provider);
    return p.generateEmbeddings(texts);
  }
}

export const embeddingService = new EmbeddingService();
