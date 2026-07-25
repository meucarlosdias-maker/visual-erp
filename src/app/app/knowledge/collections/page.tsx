'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { CollectionTable, CollectionForm } from '@/modules/knowledge/components';
import { useCollections } from '@/modules/knowledge/hooks';

export default function CollectionsPage() {
  const { data, loading, delete: remove, update, refetch } = useCollections();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Coleção removida');
    else toast.error('Erro ao remover coleção');
  }, [remove]);

  const handleToggleActive = useCallback(async (id: string, active: boolean) => {
    const ok = await update(id, { active });
    if (ok) toast.success(active ? 'Coleção ativada' : 'Coleção desativada');
    else toast.error('Erro ao alterar status');
  }, [update]);

  return (
    <CrudPage
      title="Coleções"
      description="Gerencie as bases de conhecimento da empresa"
      toolbar={<CollectionForm onSuccess={refetch} />}
    >
      {loading ? (
        <LoadingLocal message="Carregando coleções..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma coleção cadastrada.</p>
      ) : (
        <CollectionTable data={data} onDelete={handleDelete} onToggleActive={handleToggleActive} />
      )}
    </CrudPage>
  );
}
