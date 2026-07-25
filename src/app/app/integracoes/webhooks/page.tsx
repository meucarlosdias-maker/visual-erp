'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { WebhookTable } from '@/modules/api/components';
import { useWebhooks } from '@/modules/api/hooks';

export default function WebhooksPage() {
  const { data, loading, delete: remove, test, regenerateSecret } = useWebhooks();

  const handleTest = useCallback(async (id: string) => {
    const ok = await test(id);
    if (ok) toast.success('Webhook testado com sucesso');
    else toast.error('Falha ao testar webhook');
  }, [test]);

  const handleRegenerate = useCallback(async (id: string) => {
    const secret = await regenerateSecret(id);
    if (secret) toast.success('Secret regenerado');
    else toast.error('Erro ao regenerar');
  }, [regenerateSecret]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Webhook removido');
    else toast.error('Erro ao remover webhook');
  }, [remove]);

  return (
    <CrudPage
      title="Webhooks"
      description="Configure webhooks para receber eventos do sistema"
    >
      {loading ? (
        <LoadingLocal message="Carregando webhooks..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum webhook cadastrado.</p>
      ) : (
        <WebhookTable data={data} onTest={handleTest} onRegenerate={handleRegenerate} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}