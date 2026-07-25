'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { CompanySettingsForm } from '@/modules/tenants/components';
import { useCompanySettings } from '@/modules/tenants/hooks';

export default function CompanySettingsPage() {
  const { settings, loading, refetch } = useCompanySettings();

  return (
    <CrudPage
      title="Personalização"
      description="Personalize a aparência do sistema para sua empresa"
    >
      {loading ? (
        <LoadingLocal message="Carregando configurações..." />
      ) : (
        <CompanySettingsForm settings={settings} onSuccess={() => { toast.success('Configurações salvas'); refetch(); }} />
      )}
    </CrudPage>
  );
}
