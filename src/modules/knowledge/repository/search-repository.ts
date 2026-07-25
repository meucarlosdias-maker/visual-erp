import type { KnowledgeSearch } from '../types';

const mockSearches: KnowledgeSearch[] = [];

export class SearchRepository {
  async findAll(): Promise<KnowledgeSearch[]> {
    return [...mockSearches].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(data: { query: string; results: number; executionTime: number }): Promise<KnowledgeSearch> {
    const entry: KnowledgeSearch = {
      id: crypto.randomUUID(),
      userId: null,
      query: data.query,
      results: data.results,
      executionTime: data.executionTime,
      createdAt: new Date(),
    };
    mockSearches.push(entry);
    return entry;
  }
}

export const searchRepository = new SearchRepository();
