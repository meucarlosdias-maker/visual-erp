'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { CompanyTable } from '@/modules/platform/components';
import { useCompanies } from '@/modules/platform/hooks';

export default function PlatformCompaniesPage() {
  const { data, loading, block, unblock } = useCompanies();

  const handleBlock = useCallback(async (id: string) => {
    const ok = await block(id);
    if (ok) toast.success('Empresa suspensa');
    else toast.error('Erro ao suspender empresa');
  }, [block]);

  const handleUnblock = useCallback(async (id: string) => {
    const ok = await unblock(id);
    if (ok) toast.success('Empresa reativada');
    else toast.error('Erro ao reativar empresa');
  }, [unblock]);

  return (
    <CrudPage title="Empresas" description="Gerencie todas as empresas da plataforma">
      {loading ? (
        <LoadingLocal message="Carregando empresas..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma empresa cadastrada.</p>
      ) : (
        <CompanyTable companies={data} onBlock={handleBlock} onUnblock={handleUnblock} />
      )}
    </CrudPage>
  );
}
