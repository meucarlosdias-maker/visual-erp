'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { BackupTable } from '@/modules/devops/components';
import { useBackups } from '@/modules/devops/hooks';

export default function BackupsPage() {
  const { data, loading, stats } = useBackups();

  return (
    <CrudPage title="Backups" description="Gerenciamento de backups da plataforma">
      {loading ? (
        <LoadingLocal message="Carregando backups..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum backup encontrado.</p>
      ) : (
        <BackupTable backups={data} stats={stats} />
      )}
    </CrudPage>
  );
}
