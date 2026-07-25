'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { InstallationDetail } from '@/modules/installations/components/InstallationDetail';
import { useInstallation } from '@/modules/installations/hooks/use-installation';
import { toast } from '@/components/feedback';

export default function InstalacaoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: installation, loading, updateStatus } = useInstallation(id);

  const handleUpdateStatus = async (status: string) => {
    const ok = await updateStatus(status);
    if (ok) toast.success('Status atualizado');
  };

  return (
    <CrudPage title="" description="">
      <InstallationDetail
        installation={installation}
        loading={loading}
        onUpdateStatus={handleUpdateStatus}
        onBack={() => router.push('/app/instalacoes')}
      />
    </CrudPage>
  );
}
