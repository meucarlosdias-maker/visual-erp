'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from '@/constants/icons';
import { retrievalService } from '../services/retrieval-service';
import { toast } from '@/components/feedback';
import type { SearchResult } from '@/core/knowledge';

export function SearchInterface() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [context, setContext] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { results: res, context: ctx } = await retrievalService.search({
        query: query.trim(),
        type: 'fulltext',
        limit: 10,
      });
      setResults(res);
      setContext(ctx);
    } catch {
      toast.error('Erro ao realizar busca');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar na base de conhecimento..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <Button onClick={handleSearch} disabled={searching || !query.trim()}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Buscar
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{results.length} resultado(s) encontrado(s)</p>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-2">Contexto para IA</h3>
              <pre className="text-xs whitespace-pre-wrap text-muted-foreground max-h-60 overflow-y-auto">
                {context || 'Nenhum contexto gerado.'}
              </pre>
            </CardContent>
          </Card>

          {results.map((r, i) => (
            <Card key={`${r.chunkId}-${i}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">#{r.rank} - {(r.score * 100).toFixed(0)}% relevante</Badge>
                  <span className="text-xs text-muted-foreground">Doc: {r.documentId.slice(0, 8)}...</span>
                </div>
                <p className="text-sm whitespace-pre-wrap line-clamp-4">{r.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!searching && results.length === 0 && query && (
        <p className="text-center py-8 text-muted-foreground">
          Nenhum resultado encontrado. A busca semântica será ativada quando um provedor de embeddings for configurado.
        </p>
      )}
    </div>
  );
}
