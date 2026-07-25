import type { SearchResult, RankedResult } from '../types';

export function rankByScore(results: SearchResult[]): RankedResult[] {
  return results
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function normalizeScores(results: SearchResult[]): RankedResult[] {
  if (results.length === 0) return [];
  const maxScore = Math.max(...results.map((r) => r.score));
  const minScore = Math.min(...results.map((r) => r.score));
  const range = maxScore - minScore || 1;

  return results
    .map((r, i) => ({
      ...r,
      score: (r.score - minScore) / range,
      rank: i + 1,
    }))
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function applyThreshold(
  results: RankedResult[],
  minScore: number,
): RankedResult[] {
  return results.filter((r) => r.score >= minScore);
}

export function rerank(_query: string, results: RankedResult[]): RankedResult[] {
  return results.map((r) => ({
    ...r,
    reRankedScore: r.score,
  }));
}
