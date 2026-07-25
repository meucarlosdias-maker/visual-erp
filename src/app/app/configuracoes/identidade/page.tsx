'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { CompanyIdentityForm } from '@/modules/company/components/CompanyIdentityForm';
import { useCompanySettings } from '@/modules/company/hooks/use-company-settings';

export default function IdentidadePage() {
  const { settings, loading, save } = useCompanySettings();

  if (loading) return <LoadingLocal message="Carregando..." />;
  if (!settings) return <p className="text-center py-12 text-muted-foreground">Erro ao carregar.</p>;

  return (
    <CrudPage title="Identidade Visual" description="Configure a identidade visual da empresa">
      <CompanyIdentityForm settings={settings} onSave={save} />
    </CrudPage>
  );
}
