'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { EquipmentForm } from '@/modules/equipments/components/EquipmentForm';
import { useEquipment } from '@/modules/equipments/hooks/use-equipment';
import { useEquipmentCategories } from '@/modules/equipments/hooks/use-equipment-categories';
import { toast } from '@/components/feedback';
import { LoadingLocal } from '@/components/feedback';

export default function EditarEquipamentoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: equipment, loading, error, update } = useEquipment(id);
  const { data: categories } = useEquipmentCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await update(data);
    if (ok) {
      toast.success('Equipamento atualizado com sucesso');
      router.push('/app/equipamentos');
    }
    return ok;
  };

  if (loading) return <CrudPage title="Carregando..." description=""><LoadingLocal size={24} message="Carregando equipamento..." /></CrudPage>;
  if (error || !equipment) return <CrudPage title="Equipamento não encontrado" description=""><p className="text-sm text-muted-foreground">Equipamento não encontrado.</p></CrudPage>;

  return (
    <CrudPage title="Editar Equipamento" description={`Editando: ${equipment.name}`}>
      <EquipmentForm equipment={equipment} categories={categories} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
