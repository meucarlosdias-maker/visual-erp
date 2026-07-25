import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Mail, Phone, Send, Bell, Trash2, CheckCheck } from '@/constants/icons';
import type { ConversationWithLastMessage, NotificationRecord, InboxSummary, CommunicationChannel, ConversationStatus } from '@/core/communication';

const channelLabels: Record<CommunicationChannel, string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  sms: 'SMS',
  telegram: 'Telegram',
  instagram: 'Instagram',
  facebook: 'Facebook Messenger',
  chat: 'Chat Interno',
  push: 'Push Notification',
};

const channelColors: Record<CommunicationChannel, string> = {
  whatsapp: 'text-green-600 bg-green-50',
  email: 'text-blue-600 bg-blue-50',
  sms: 'text-purple-600 bg-purple-50',
  telegram: 'text-sky-600 bg-sky-50',
  instagram: 'text-pink-600 bg-pink-50',
  facebook: 'text-indigo-600 bg-indigo-50',
  chat: 'text-gray-600 bg-gray-50',
  push: 'text-orange-600 bg-orange-50',
};

const statusLabels: Record<ConversationStatus, string> = {
  active: 'Ativo',
  waiting: 'Aguardando',
  closed: 'Fechado',
};

const statusColors: Record<ConversationStatus, string> = {
  active: 'bg-green-100 text-green-800',
  waiting: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800',
};

const typeLabels: Record<string, string> = {
  system: 'Sistema',
  approval: 'Aprovações',
  financial: 'Financeiro',
  production: 'Produção',
  crm: 'CRM',
  schedule: 'Agenda',
  ai: 'IA',
};

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('pt-BR');
}

function getChannelIcon(channel: CommunicationChannel) {
  switch (channel) {
    case 'whatsapp': return Phone;
    case 'email': return Mail;
    case 'chat': return MessageSquare;
    default: return Send;
  }
}

export function InboxConversationItem({
  item,
  onSelect,
  selected,
}: {
  item: ConversationWithLastMessage;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  const Icon = getChannelIcon(item.conversation.channel);

  return (
    <button
      onClick={() => onSelect(item.conversation.id)}
      className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-accent ${
        selected ? 'bg-accent ring-1 ring-primary' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${channelColors[item.conversation.channel]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate">
              {item.conversation.customerName ?? 'Desconhecido'}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {item.conversation.lastMessageAt ? formatRelativeTime(item.conversation.lastMessageAt) : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">{channelLabels[item.conversation.channel]}</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[item.conversation.status]}`}>
              {statusLabels[item.conversation.status]}
            </Badge>
          </div>
          {item.lastMessage && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {item.lastMessage.direction === 'outbound' ? 'Você: ' : ''}
              {item.lastMessage.content}
            </p>
          )}
        </div>
        {item.unreadCount > 0 && (
          <Badge className="bg-primary text-primary-foreground text-[10px] min-w-[18px] h-[18px] flex items-center justify-center">
            {item.unreadCount}
          </Badge>
        )}
      </div>
    </button>
  );
}

export function InboxSummaryCards({ summary }: { summary: InboxSummary }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs text-muted-foreground">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summary.total}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs text-muted-foreground">Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{summary.active}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs text-muted-foreground">Aguardando</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-yellow-600">{summary.waiting}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs text-muted-foreground">Fechadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gray-500">{summary.closed}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: NotificationRecord;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/50 border-primary/20'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {typeLabels[notification.type] ?? notification.type}
          </Badge>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
        </div>
        <p className="text-sm font-medium mt-1">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {!notification.read && (
          <Button variant="ghost" size="icon-sm" onClick={() => onMarkAsRead(notification.id)}>
            <CheckCheck className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={() => onDelete(notification.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
