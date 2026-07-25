'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { PlatformUserTable } from '@/modules/platform/components';
import { usePlatformUsers } from '@/modules/platform/hooks';

export default function PlatformUsersPage() {
  const { data, loading } = usePlatformUsers();

  return (
    <CrudPage title="Usuários da Plataforma" description="Gerencie os administradores globais do Visual ERP">
      {loading ? (
        <LoadingLocal message="Carregando usuários..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum usuário da plataforma.</p>
      ) : (
        <PlatformUserTable users={data} />
      )}
    </CrudPage>
  );
}
