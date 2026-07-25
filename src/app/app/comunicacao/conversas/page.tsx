'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare, Phone, Mail, Send } from '@/constants/icons';
import { useConversations } from '@/modules/communication';
import type { CommunicationChannel, ConversationStatus } from '@/core/communication';

const channelIcons: Record<CommunicationChannel, React.ComponentType<{ className?: string }>> = {
  whatsapp: Phone,
  email: Mail,
  sms: Send,
  telegram: Send,
  instagram: Send,
  facebook: MessageSquare,
  chat: MessageSquare,
  push: Send,
};

const channelLabels: Record<CommunicationChannel, string> = {
  whatsapp: 'WhatsApp', email: 'E-mail', sms: 'SMS', telegram: 'Telegram',
  instagram: 'Instagram', facebook: 'Facebook Messenger', chat: 'Chat Interno', push: 'Push',
};

const statusLabels: Record<ConversationStatus, string> = {
  active: 'Ativo',
  waiting: 'Aguardando',
  closed: 'Fechado',
};

export default function ConversasPage() {
  const { data, loading } = useConversations();
  const [search, setSearch] = useState('');

  const filtered = data.filter((c) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return c.customerName?.toLowerCase().includes(term) ?? false;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Conversas</h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as conversas do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Nova Conversa
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar conversas..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhuma conversa encontrada.</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((conv) => {
            const Icon = channelIcons[conv.channel];
            return (
              <Card key={conv.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{conv.customerName ?? 'Desconhecido'}</p>
                        <p className="text-xs text-muted-foreground">{channelLabels[conv.channel]}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        conv.status === 'active' ? 'bg-green-100 text-green-800' :
                        conv.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {statusLabels[conv.status]}
                      </Badge>
                      {conv.assignedUserId && (
                        <Badge variant="secondary" className="text-[10px]">
                          ID: {conv.assignedUserId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
