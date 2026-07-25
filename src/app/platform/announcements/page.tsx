'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { AnnouncementTable } from '@/modules/platform/components';
import { useAnnouncements } from '@/modules/platform/hooks';

export default function PlatformAnnouncementsPage() {
  const { data, loading, delete: remove } = useAnnouncements();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Aviso removido');
    else toast.error('Erro ao remover aviso');
  }, [remove]);

  return (
    <CrudPage title="Avisos" description="Publique avisos para todas as empresas">
      {loading ? (
        <LoadingLocal message="Carregando avisos..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum aviso publicado.</p>
      ) : (
        <AnnouncementTable announcements={data} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
