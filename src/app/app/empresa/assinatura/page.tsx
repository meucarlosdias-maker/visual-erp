'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { SubscriptionInfoCard } from '@/modules/tenants/components';
import { useSubscription } from '@/modules/tenants/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CreditCard } from '@/constants/icons';
import { SubscriptionService } from '@/modules/tenants/services';

export default function SubscriptionPage() {
  const { subscription, loading, refetch } = useSubscription();

  const handleCancel = useCallback(async () => {
    if (!subscription) return;
    const ok = await SubscriptionService.cancel(subscription.companyId);
    if (ok) {
      toast.success('Assinatura cancelada');
      refetch();
    } else {
      toast.error('Erro ao cancelar assinatura');
    }
  }, [subscription, refetch]);

  return (
    <CrudPage
      title="Assinatura"
      description="Gerencie sua assinatura e métodos de pagamento"
    >
      {loading ? (
        <LoadingLocal message="Carregando assinatura..." />
      ) : !subscription ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma assinatura ativa.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubscriptionInfoCard subscription={subscription} />
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Gerenciar Assinatura
              </CardTitle>
              <CardDescription>Ações disponíveis para sua assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = '/app/empresa/plano'}
              >
                Alterar Plano
              </Button>
              {subscription.status === 'active' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Cancelar Assinatura
                </Button>
              )}
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md text-sm">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  O cancelamento da assinatura não remove seus dados. Você poderá reativá-la quando desejar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </CrudPage>
  );
}
