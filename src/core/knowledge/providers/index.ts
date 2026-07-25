import type { EmbeddingProvider, KnowledgeProvider } from '../types';

const providerDefinitions: Record<string, KnowledgeProvider> = {
  openai: {
    name: 'OpenAI Embeddings',
    type: 'openai',
    async generateEmbedding(_text: string): Promise<number[]> {
      throw new Error('OpenAI Embeddings não configurados. Configure a API key no módulo de IA.');
    },
    async generateEmbeddings(_texts: string[]): Promise<number[][]> {
      throw new Error('OpenAI Embeddings não configurados. Configure a API key no módulo de IA.');
    },
  },
  local: {
    name: 'Local Embeddings',
    type: 'local',
    async generateEmbedding(_text: string): Promise<number[]> {
      throw new Error('Embeddings locais não implementados nesta versão.');
    },
    async generateEmbeddings(_texts: string[]): Promise<number[][]> {
      throw new Error('Embeddings locais não implementados nesta versão.');
    },
  },
};

export function getKnowledgeProvider(type: EmbeddingProvider): KnowledgeProvider {
  const provider = providerDefinitions[type];
  if (!provider) throw new Error(`Provedor de conhecimento não encontrado: ${type}`);
  return provider;
}

export function getProviderDefinitions(): KnowledgeProvider[] {
  return Object.values(providerDefinitions);
}
