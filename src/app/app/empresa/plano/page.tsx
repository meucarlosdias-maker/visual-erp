'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { PlanCard } from '@/modules/tenants/components';
import { usePlans, useSubscription } from '@/modules/tenants/hooks';
import { SubscriptionInfoCard } from '@/modules/tenants/components';

export default function CompanyPlanPage() {
  const { plans, loading } = usePlans();
  const { subscription, loading: subLoading, refetch } = useSubscription();

  const handleSelectPlan = useCallback(async (planId: string) => {
    try {
      await (await import('@/modules/tenants/services')).SubscriptionService.changePlan('company-1', planId);
      toast.success('Plano alterado com sucesso');
      refetch();
    } catch {
      toast.error('Erro ao alterar plano');
    }
  }, [refetch]);

  return (
    <CrudPage
      title="Plano"
      description="Gerencie seu plano de assinatura"
    >
      {subLoading ? (
        <LoadingLocal message="Carregando assinatura..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscription && (
            <div className="md:col-span-3">
              <SubscriptionInfoCard subscription={subscription} />
            </div>
          )}
        </div>
      )}
      {loading ? (
        <LoadingLocal message="Carregando planos..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={subscription?.planId === plan.id}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      )}
    </CrudPage>
  );
}
