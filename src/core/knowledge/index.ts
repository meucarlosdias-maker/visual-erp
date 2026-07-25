export { knowledgeService } from './services';
export { chunkDocument, getDefaultChunkConfig } from './chunking';
export { generateEmbedding, generateEmbeddings, cosineSimilarity, getDefaultEmbeddingConfig } from './embeddings';
export { searchFullText, searchVector, searchHybrid, buildSearchContext } from './retrieval';
export { rankByScore, normalizeScores, applyThreshold, rerank } from './ranking';
export { getKnowledgeProvider, getProviderDefinitions } from './providers';
export { processIngestion, extractTextFromFile, extractTextFromString } from './ingestion';
export type {
  DocumentStatus, ChunkingStrategy, SearchType, EmbeddingProvider,
  ChunkConfig, DocumentChunk, EmbeddingConfig, EmbeddingResult,
  SearchQuery, SearchResult, RankedResult, IngestionPipeline, IngestionResult,
  KnowledgeProvider, CollectionSummary, DocumentSummary,
} from './types';
