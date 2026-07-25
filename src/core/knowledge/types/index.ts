export type DocumentStatus = 'pending' | 'processing' | 'indexed' | 'failed';

export type ChunkingStrategy = 'fixed' | 'paragraph' | 'sentence' | 'markdown' | 'hybrid';

export type SearchType = 'fulltext' | 'vector' | 'hybrid';

export type EmbeddingProvider = 'openai' | 'gemini' | 'anthropic' | 'local';

export interface ChunkConfig {
  strategy: ChunkingStrategy;
  maxSize: number;
  overlap: number;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  tokens: number;
}

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  model: string;
  dimensions: number;
}

export interface EmbeddingResult {
  id: string;
  chunkId: string;
  vector: number[];
  model: string;
  dimensions: number;
}

export interface SearchQuery {
  text: string;
  collectionIds?: string[];
  type: SearchType;
  limit: number;
  minScore?: number;
}

export interface SearchResult {
  chunkId: string;
  documentId: string;
  collectionId: string;
  content: string;
  score: number;
  rank: number;
}

export interface RankedResult extends SearchResult {
  reRankedScore?: number;
}

export interface IngestionPipeline {
  documentId: string;
  title: string;
  fileName: string;
  fileType: string;
  content: string;
  collectionId: string;
}

export interface KnowledgeProvider {
  name: string;
  type: EmbeddingProvider;
  generateEmbedding(text: string): Promise<number[]>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  documentCount: number;
  chunkCount: number;
  active: boolean;
}

export interface DocumentSummary {
  id: string;
  collectionId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: DocumentStatus;
  chunkCount: number;
  createdAt: Date;
}

export interface IngestionResult {
  documentId: string;
  chunks: DocumentChunk[];
  totalTokens: number;
  chunkCount: number;
}
