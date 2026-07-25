'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { ApiKeyTable, ApiKeyForm } from '@/modules/api/components';
import { useApiKeys } from '@/modules/api/hooks';

export default function ApiKeysPage() {
  const { data, loading, delete: remove, regenerateSecret, refetch } = useApiKeys();

  const handleRegenerate = useCallback(async (id: string) => {
    const secret = await regenerateSecret(id);
    if (secret) {
      toast.success('Secret regenerado com sucesso');
    } else {
      toast.error('Erro ao regenerar secret');
    }
  }, [regenerateSecret]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Chave de API removida');
    else toast.error('Erro ao remover chave');
  }, [remove]);

  return (
    <CrudPage
      title="API Keys"
      description="Gerencie as chaves de API para integrações externas"
      toolbar={<ApiKeyForm onSuccess={refetch} />}
    >
      {loading ? (
        <LoadingLocal message="Carregando chaves de API..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma chave de API cadastrada.</p>
      ) : (
        <ApiKeyTable data={data} onRegenerate={handleRegenerate} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}