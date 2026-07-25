'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { TeamForm } from '@/modules/teams/components/TeamForm';
import { useTeams } from '@/modules/teams/hooks/use-teams';
import { toast } from '@/components/feedback';

export default function NovaEquipePage() {
  const router = useRouter();
  const { create } = useTeams();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Equipe criada com sucesso');
      router.push('/app/equipes');
    }
    return ok;
  };

  return (
    <CrudPage title="Nova Equipe" description="Cadastre uma nova equipe">
      <TeamForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
