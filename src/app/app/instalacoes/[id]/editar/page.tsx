'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { InstallationForm } from '@/modules/installations/components/InstallationForm';
import { useInstallation } from '@/modules/installations/hooks/use-installation';
import { LoadingLocal } from '@/components/feedback';
import { toast } from '@/components/feedback';

export default function EditarInstalacaoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: installation, loading, update } = useInstallation(id);

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await update(data);
    if (ok) {
      toast.success('Instalação atualizada');
      router.push(`/app/instalacoes/${id}`);
    }
    return ok;
  };

  if (loading) return <LoadingLocal message="Carregando..." />;
  if (!installation) return <p className="text-center py-12 text-muted-foreground">Instalação não encontrada.</p>;

  return (
    <CrudPage title={`Editar Instalação ${installation.number}`} description="Atualize os dados da instalação">
      <InstallationForm installation={installation} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
