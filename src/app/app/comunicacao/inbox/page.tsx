'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from '@/constants/icons';
import { useInbox, useInboxFilter } from '@/modules/communication';
import { InboxConversationItem, InboxSummaryCards } from '@/modules/communication';
import type { CommunicationChannel, ConversationStatus } from '@/core/communication';

export default function InboxPage() {
  const { data, summary, loading } = useInbox();
  const { channel, setChannel, status, setStatus, search, setSearch, reset, hasFilter } = useInboxFilter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredData = data.filter((item) => {
    if (channel && item.conversation.channel !== channel) return false;
    if (status && item.conversation.status !== status) return false;
    if (search) {
      const term = search.toLowerCase();
      const name = item.conversation.customerName?.toLowerCase() ?? '';
      if (!name.includes(term)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Caixa de Entrada</h1>
          <p className="text-sm text-muted-foreground">Central de atendimento unificado</p>
        </div>
      </div>

      <InboxSummaryCards summary={summary} />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar conversas..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as ConversationStatus | '')}
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="waiting">Aguardando</option>
          <option value="closed">Fechado</option>
        </select>
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
          value={channel}
          onChange={(e) => setChannel(e.target.value as CommunicationChannel | '')}
        >
          <option value="">Todos os canais</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">E-mail</option>
          <option value="chat">Chat Interno</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="sms">SMS</option>
          <option value="telegram">Telegram</option>
        </select>
        {hasFilter && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <Filter className="h-4 w-4 mr-1" /> Limpar
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma conversa encontrada.
        </div>
      ) : (
        <div className="space-y-1">
          {filteredData.map((item) => (
            <InboxConversationItem
              key={item.conversation.id}
              item={item}
              selected={selectedId === item.conversation.id}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
