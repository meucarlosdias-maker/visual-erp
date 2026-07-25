'use client';

import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from '@/constants/icons';
import { useNotifications } from '@/modules/communication';
import { NotificationItem } from '@/modules/communication';

export default function NotificacoesPage() {
  const { data, unreadCount, loading, markAsRead, markAllAsRead, delete: deleteNotification } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Notificações</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lida(s)` : 'Todas lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" /> Marcar todas como lidas
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Bell className="h-12 w-12 mb-3 opacity-50" />
          <p>Nenhuma notificação</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
