import { chunkRepository } from '../repository/chunk-repository';
import { knowledgeService } from '@/core/knowledge';
import type { KnowledgeChunk } from '../types';
import type { ChunkInput } from '../schemas';

export class ChunkService {
  async chunkDocument(documentId: string, content: string): Promise<KnowledgeChunk[]> {
    const chunks = knowledgeService.chunk(documentId, content);
    const inputs: ChunkInput[] = chunks.map((c) => ({
      documentId: c.documentId,
      chunkIndex: c.chunkIndex,
      content: c.content,
      tokens: c.tokens,
    }));
    return chunkRepository.createMany(inputs);
  }

  async findByDocument(documentId: string): Promise<KnowledgeChunk[]> {
    return chunkRepository.findByDocument(documentId);
  }

  async deleteByDocument(documentId: string): Promise<void> {
    return chunkRepository.deleteByDocument(documentId);
  }
}

export const chunkService = new ChunkService();
