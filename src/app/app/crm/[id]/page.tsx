'use client';

import { useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingLocal, toast } from '@/components/feedback';
import { LeadDetail } from '@/modules/crm/components/LeadDetail';
import { ActivityTimeline } from '@/modules/crm/components/ActivityTimeline';
import { VisitCard } from '@/modules/crm/components/VisitCard';
import { useLead } from '@/modules/crm/hooks/use-lead';
import { useLeadActivities } from '@/modules/crm/hooks/use-lead-activities';
import { useVisits } from '@/modules/crm/hooks/use-visits';
import type { Lead } from '@/modules/crm/types';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: lead, loading: leadLoading, update } = useLead(id);
  const { data: activities, loading: activitiesLoading, create: createActivity, delete: removeActivity } = useLeadActivities(id);
  const { data: visits, loading: visitsLoading } = useVisits(id);

  if (leadLoading) return <LoadingLocal message="Carregando lead..." />;
  if (!lead) return <p className="text-center py-12 text-muted-foreground">Lead não encontrado.</p>;

  const handleUpdate = async (patch: Partial<Lead>) => {
    const ok = await update(patch);
    if (ok) toast.success('Lead atualizado');
    else toast.error('Erro ao atualizar lead');
    return ok;
  };

  return (
    <CrudPage title={`Lead ${lead.number}`} description="">
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
          <TabsTrigger value="visits">Visitas</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <LeadDetail lead={lead} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          {activitiesLoading ? (
            <LoadingLocal message="Carregando atividades..." />
          ) : (
            <ActivityTimeline
              activities={activities}
              onCreate={createActivity}
              onDelete={removeActivity}
            />
          )}
        </TabsContent>

        <TabsContent value="visits" className="mt-6">
          {visitsLoading ? (
            <LoadingLocal message="Carregando visitas..." />
          ) : (
            <VisitCard visits={visits} />
          )}
        </TabsContent>
      </Tabs>
    </CrudPage>
  );
}
