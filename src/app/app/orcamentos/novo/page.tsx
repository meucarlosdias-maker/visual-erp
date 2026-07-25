'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { QuotationForm } from '@/modules/quotations/components/QuotationForm';
import { useQuotations } from '@/modules/quotations/hooks/use-quotations';
import { toast } from '@/components/feedback';

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const { create } = useQuotations();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Orçamento criado com sucesso');
      router.push('/app/orcamentos');
    }
    return ok;
  };

  return (
    <CrudPage title="Novo Orçamento" description="Crie um novo orçamento comercial">
      <QuotationForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
