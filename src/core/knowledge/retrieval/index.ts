import type { SearchQuery, SearchResult } from '../types';

export async function searchFullText(
  _query: SearchQuery,
): Promise<SearchResult[]> {
  throw new Error(
    'Busca full-text não implementada. Configure um provedor de busca para ativar esta funcionalidade.',
  );
}

export async function searchVector(
  _query: SearchQuery,
): Promise<SearchResult[]> {
  throw new Error(
    'Busca vetorial não implementada. Configure um provedor de embeddings para ativar esta funcionalidade.',
  );
}

export async function searchHybrid(
  query: SearchQuery,
): Promise<SearchResult[]> {
  const fullTextResults = await searchFullText(query);
  const vectorResults = await searchVector(query);

  const merged = new Map<string, SearchResult>();
  for (const r of fullTextResults) {
    merged.set(r.chunkId, { ...r, score: r.score * 0.5 });
  }
  for (const r of vectorResults) {
    const existing = merged.get(r.chunkId);
    if (existing) {
      merged.set(r.chunkId, { ...existing, score: existing.score + r.score * 0.5 });
    } else {
      merged.set(r.chunkId, { ...r, score: r.score * 0.5 });
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, query.limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function buildSearchContext(results: SearchResult[], maxTokens: number = 4000): string {
  let context = '';
  let totalTokens = 0;

  for (const result of results) {
    const estimatedTokens = Math.ceil(result.content.length / 4);
    if (totalTokens + estimatedTokens > maxTokens) break;
    context += `[Fonte: Documento ${result.documentId}, Relevância: ${(result.score * 100).toFixed(0)}%]\n${result.content}\n\n`;
    totalTokens += estimatedTokens;
  }

  return context;
}
