import type { SearchQuery, SearchResult, RankedResult, DocumentChunk, ChunkConfig, IngestionPipeline, IngestionResult } from '../types';
import { chunkDocument, getDefaultChunkConfig } from '../chunking';
import { searchFullText, searchVector, searchHybrid, buildSearchContext } from '../retrieval';
import { rankByScore, normalizeScores, applyThreshold } from '../ranking';
import { processIngestion } from '../ingestion';

export class KnowledgeService {
  chunk(
    documentId: string,
    content: string,
    config?: Partial<ChunkConfig>,
  ): DocumentChunk[] {
    const mergedConfig: ChunkConfig = { ...getDefaultChunkConfig(), ...config };
    return chunkDocument(documentId, content, mergedConfig);
  }

  async search(query: SearchQuery): Promise<SearchResult[]> {
    switch (query.type) {
      case 'fulltext':
        return searchFullText(query);
      case 'vector':
        return searchVector(query);
      case 'hybrid':
        return searchHybrid(query);
      default:
        return searchFullText(query);
    }
  }

  rank(results: SearchResult[]): RankedResult[] {
    const normalized = normalizeScores(results);
    return applyThreshold(normalized, 0.1);
  }

  buildContext(results: SearchResult[], maxTokens?: number): string {
    return buildSearchContext(results, maxTokens);
  }

  async ingest(pipeline: IngestionPipeline): Promise<IngestionResult> {
    return processIngestion(pipeline);
  }
}

export const knowledgeService = new KnowledgeService();
