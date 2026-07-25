'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { QuotationDetail } from '@/modules/quotations/components/QuotationDetail';
import { useQuotation } from '@/modules/quotations/hooks/use-quotation';
import { toast } from '@/components/feedback';

export default function OrcamentoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: quotation, loading, updateStatus: updateSingleStatus } = useQuotation(id);

  const handleUpdateStatus = async (status: string) => {
    const ok = await updateSingleStatus(status);
    if (ok) toast.success(`Status alterado`);
  };

  return (
    <CrudPage title="" description="">
      <QuotationDetail
        quotation={quotation}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
        onBack={() => router.push('/app/orcamentos')}
      />
    </CrudPage>
  );
}
