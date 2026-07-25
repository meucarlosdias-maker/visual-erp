'use client';

import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/document-service';
import type { KnowledgeDocument } from '../types';
import type { DocumentInput, DocumentUpdate } from '../schemas';

export function useDocuments() {
  const [data, setData] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await documentService.list();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar documentos'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (input: DocumentInput): Promise<boolean> => {
    try {
      await documentService.create(input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar documento'));
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, input: DocumentUpdate): Promise<boolean> => {
    try {
      await documentService.update(id, input);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao atualizar documento'));
      return false;
    }
  }, [fetch]);

  const delete_ = useCallback(async (id: string): Promise<boolean> => {
    try {
      await documentService.delete(id);
      setData((prev) => prev.filter((d) => d.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir documento'));
      return false;
    }
  }, []);

  return { data, loading, error, create, update, delete: delete_, refetch: fetch };
}
