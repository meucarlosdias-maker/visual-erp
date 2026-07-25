'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { CompanySequenceForm } from '@/modules/company/components/CompanySequenceForm';
import { useCompanySequences } from '@/modules/company/hooks/use-company-settings';

export default function NumeracoesPage() {
  const { sequences, loading, update } = useCompanySequences();

  if (loading) return <LoadingLocal message="Carregando..." />;

  return (
    <CrudPage title="Numerações" description="Configure as sequências numéricas do sistema">
      <CompanySequenceForm sequences={sequences} onUpdate={update} />
    </CrudPage>
  );
}
