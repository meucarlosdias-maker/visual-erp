'use client';

import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chat-service';
import { providerService } from '../services/provider-service';
import type { AiConversation } from '../types';
import type { AIProviderConfig } from '@/core/ai';

export function useConversations() {
  const [data, setData] = useState<AiConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await chatService.listConversations();
      setData(list);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar conversas'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createConversation = useCallback(async (title: string, module?: string): Promise<AiConversation | null> => {
    try {
      const conv = await chatService.createConversation(title, module);
      await fetch();
      return conv;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao criar conversa'));
      return null;
    }
  }, [fetch]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    systemPrompt?: string,
  ): Promise<{ reply: string } | null> => {
    try {
      const providers = await providerService.findActive();
      const activeProvider = providers[0];
      if (!activeProvider) {
        setError(new Error('Nenhum provedor de IA ativo configurado'));
        return null;
      }
      const providerConfig: AIProviderConfig = {
        id: activeProvider.id,
        name: activeProvider.name,
        provider: activeProvider.provider as AIProviderConfig['provider'],
        model: activeProvider.model,
        apiKey: activeProvider.apiKey,
        temperature: activeProvider.temperature,
        maxTokens: activeProvider.maxTokens,
      };
      const result = await chatService.sendMessage(conversationId, content, providerConfig, systemPrompt);
      await fetch();
      return { reply: result.reply };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar mensagem'));
      return null;
    }
  }, [fetch]);

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      await chatService.deleteConversation(id);
      setData((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao excluir conversa'));
      return false;
    }
  }, []);

  return { data, loading, error, createConversation, sendMessage, deleteConversation, refetch: fetch };
}
