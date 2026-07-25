'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { DocumentTable } from '@/modules/knowledge/components';
import { useDocuments } from '@/modules/knowledge/hooks';

export default function DocumentsPage() {
  const { data, loading, delete: remove } = useDocuments();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Documento removido');
    else toast.error('Erro ao remover documento');
  }, [remove]);

  return (
    <CrudPage
      title="Documentos"
      description="Documentos indexados na base de conhecimento"
    >
      {loading ? (
        <LoadingLocal message="Carregando documentos..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum documento cadastrado.</p>
      ) : (
        <DocumentTable data={data} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
