'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { TeamForm } from '@/modules/teams/components/TeamForm';
import { useTeam } from '@/modules/teams/hooks/use-team';
import { useMembers } from '@/modules/teams/hooks/use-members';
import { useProductivity } from '@/modules/teams/hooks/use-productivity';
import { toast } from '@/components/feedback';
import { LoadingLocal } from '@/components/feedback';

export default function EditarEquipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: team, loading, error, update } = useTeam(id);
  const { create: addMember, update: updateMember, delete: removeMember } = useMembers(id);
  const { create: addProductivity, delete: removeProductivity } = useProductivity(id);

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await update(data);
    if (ok) {
      toast.success('Equipe atualizada com sucesso');
      router.push('/app/equipes');
    }
    return ok;
  };

  const handleAddMember = async (data: Record<string, unknown>) => {
    const ok = await addMember(data);
    if (ok) {
      toast.success('Membro adicionado');
    }
    return ok;
  };

  const handleUpdateMember = async (memberId: string, data: Record<string, unknown>) => {
    const ok = await updateMember(memberId, data);
    if (ok) toast.success('Membro atualizado');
    return ok;
  };

  const handleRemoveMember = async (memberId: string) => {
    const ok = await removeMember(memberId);
    if (ok) toast.success('Membro removido');
    return ok;
  };

  const handleAddProductivity = async (data: Record<string, unknown>) => {
    const ok = await addProductivity(data);
    if (ok) {
      toast.success('Produtividade adicionada');
    }
    return ok;
  };

  const handleRemoveProductivity = async (prodId: string) => {
    const ok = await removeProductivity(prodId);
    if (ok) {
      toast.success('Produtividade removida');
    }
    return ok;
  };

  if (loading) return <CrudPage title="Carregando..." description=""><LoadingLocal size={24} message="Carregando equipe..." /></CrudPage>;
  if (error || !team) return <CrudPage title="Equipe não encontrada" description=""><p className="text-sm text-muted-foreground">Equipe não encontrada.</p></CrudPage>;

  return (
    <CrudPage title="Editar Equipe" description={`Editando: ${team.name}`}>
      <TeamForm
        team={team}
        onSave={handleSave}
        onCancel={() => router.back()}
        onAddMember={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onRemoveMember={handleRemoveMember}
        onAddProductivity={handleAddProductivity}
        onRemoveProductivity={handleRemoveProductivity}
      />
    </CrudPage>
  );
}
