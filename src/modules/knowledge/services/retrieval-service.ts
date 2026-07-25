import { knowledgeService } from '@/core/knowledge';
import { searchRepository } from '../repository/search-repository';
import type { SearchInput } from '../schemas';
import type { SearchResult } from '@/core/knowledge';

export class RetrievalService {
  async search(input: SearchInput): Promise<{ results: SearchResult[]; context: string; executionTime: number }> {
    const start = performance.now();

    const results = await knowledgeService.search({
      text: input.query,
      collectionIds: input.collectionIds,
      type: input.type,
      limit: input.limit,
    });

    const context = knowledgeService.buildContext(results);

    const executionTime = Math.round(performance.now() - start);

    await searchRepository.create({
      query: input.query,
      results: results.length,
      executionTime,
    });

    return { results, context, executionTime };
  }
}

export const retrievalService = new RetrievalService();
