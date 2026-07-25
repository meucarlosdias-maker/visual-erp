import type { KnowledgeChunk } from '../types';
import type { ChunkInput } from '../schemas';

const mockChunks: KnowledgeChunk[] = [];

export class ChunkRepository {
  async findByDocument(documentId: string): Promise<KnowledgeChunk[]> {
    return mockChunks
      .filter((c) => c.documentId === documentId)
      .sort((a, b) => a.chunkIndex - b.chunkIndex);
  }

  async create(input: ChunkInput): Promise<KnowledgeChunk> {
    const entry: KnowledgeChunk = {
      id: crypto.randomUUID(),
      documentId: input.documentId,
      chunkIndex: input.chunkIndex,
      content: input.content,
      embeddingId: null,
      tokens: input.tokens,
      createdAt: new Date(),
    };
    mockChunks.push(entry);
    return entry;
  }

  async createMany(inputs: ChunkInput[]): Promise<KnowledgeChunk[]> {
    return Promise.all(inputs.map((i) => this.create(i)));
  }

  async deleteByDocument(documentId: string): Promise<void> {
    const indices = mockChunks
      .map((c, i) => (c.documentId === documentId ? i : -1))
      .filter((i) => i >= 0)
      .reverse();
    for (const i of indices) {
      mockChunks.splice(i, 1);
    }
  }
}

export const chunkRepository = new ChunkRepository();
