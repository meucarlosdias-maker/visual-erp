'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionInfo as SubInfo } from '@/core/tenant';

export function SubscriptionInfoCard({ subscription }: { subscription: SubInfo | null }) {
  if (!subscription) return null;

  const statusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default' as const;
      case 'trial': return 'secondary' as const;
      case 'expired': return 'destructive' as const;
      case 'cancelled': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const statusLabel: Record<string, string> = {
    active: 'Ativa',
    trial: 'Trial',
    expired: 'Expirada',
    cancelled: 'Cancelada',
    suspended: 'Suspensa',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Assinatura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Plano</span>
          <span className="font-medium">{subscription.planName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <Badge variant={statusVariant(subscription.status)}>
            {statusLabel[subscription.status] ?? subscription.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Início</span>
          <span>{new Date(subscription.startedAt).toLocaleDateString('pt-BR')}</span>
        </div>
        {subscription.expiresAt && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Expira</span>
            <span>{new Date(subscription.expiresAt).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        {subscription.renewalDate && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Renovação</span>
            <span>{new Date(subscription.renewalDate).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        {subscription.paymentMethod && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pagamento</span>
            <span>{subscription.paymentMethod === 'credit_card' ? 'Cartão de crédito' : subscription.paymentMethod}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
