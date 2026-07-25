'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { QuotationForm } from '@/modules/quotations/components/QuotationForm';
import { useQuotation } from '@/modules/quotations/hooks/use-quotation';
import { useQuotations } from '@/modules/quotations/hooks/use-quotations';
import { toast } from '@/components/feedback';
import { LoadingLocal } from '@/components/feedback';

export default function EditarOrcamentoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: quotation, loading, error } = useQuotation(id);
  const { update } = useQuotations();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await update(id, data);
    if (ok) {
      toast.success('Orçamento atualizado com sucesso');
      router.push(`/app/orcamentos/${id}`);
    }
    return ok;
  };

  if (loading) {
    return (
      <CrudPage title="Carregando..." description="">
        <LoadingLocal size={24} message="Carregando orçamento..." />
      </CrudPage>
    );
  }

  if (error || !quotation) {
    return (
      <CrudPage title="Orçamento não encontrado" description="">
        <p className="text-sm text-muted-foreground">Orçamento não encontrado.</p>
      </CrudPage>
    );
  }

  return (
    <CrudPage title="Editar Orçamento" description={`Editando: ${quotation.number} v${quotation.version}`}>
      <QuotationForm quotation={quotation} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
