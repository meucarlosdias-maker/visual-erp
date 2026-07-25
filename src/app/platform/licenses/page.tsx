'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { LicenseTable } from '@/modules/platform/components';
import { useLicenses } from '@/modules/platform/hooks';

export default function PlatformLicensesPage() {
  const { data, loading } = useLicenses();

  return (
    <CrudPage title="Licenças" description="Gerencie as licenças das empresas">
      {loading ? (
        <LoadingLocal message="Carregando licenças..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma licença encontrada.</p>
      ) : (
        <LicenseTable licenses={data} />
      )}
    </CrudPage>
  );
}
