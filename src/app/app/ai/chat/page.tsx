'use client';

import { useState, useEffect } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { ChatInterface } from '@/modules/ai/components';
import { chatService } from '@/modules/ai/services/chat-service';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/feedback';
import { Plus } from '@/constants/icons';
import type { AiConversation } from '@/modules/ai/types';

export default function AiChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chatService.listConversations()
      .then((conversations) => {
        if (conversations.length > 0) {
          const latest = conversations.reduce((a, b) =>
            a.updatedAt > b.updatedAt ? a : b
          );
          setConversationId(latest.id);
        } else {
          return chatService.createConversation('Nova conversa');
        }
      })
      .then((conv) => {
        if (conv) setConversationId((conv as AiConversation).id);
      })
      .catch(() => toast.error('Erro ao iniciar conversa'))
      .finally(() => setLoading(false));
  }, []);

  const handleNewConversation = async () => {
    setLoading(true);
    try {
      const conv = await chatService.createConversation('Nova conversa');
      setConversationId(conv.id);
    } catch {
      toast.error('Erro ao criar conversa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CrudPage
      title="Assistente de IA"
      description="Converse com a inteligência artificial do Visual ERP"
      toolbar={
        <Button size="sm" onClick={handleNewConversation}>
          <Plus className="mr-2 h-4 w-4" />Nova Conversa
        </Button>
      }
    >
      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Iniciando conversa...</p>
      ) : conversationId ? (
        <ChatInterface conversationId={conversationId} />
      ) : (
        <p className="text-center py-12 text-muted-foreground">Erro ao iniciar conversa.</p>
      )}
    </CrudPage>
  );
}
