'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { PromptTable, PromptForm } from '@/modules/ai/components';
import { usePrompts } from '@/modules/ai/hooks';

export default function AiPromptsPage() {
  const { data, loading, delete: remove, refetch } = usePrompts();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Prompt removido');
    else toast.error('Erro ao remover prompt');
  }, [remove]);

  return (
    <CrudPage
      title="Biblioteca de Prompts"
      description="Gerencie prompts de IA por módulo do sistema"
      toolbar={<PromptForm onSuccess={refetch} />}
    >
      {loading ? (
        <LoadingLocal message="Carregando prompts..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum prompt cadastrado.</p>
      ) : (
        <PromptTable data={data} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
