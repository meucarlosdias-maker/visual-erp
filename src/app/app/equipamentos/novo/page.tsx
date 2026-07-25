'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { EquipmentForm } from '@/modules/equipments/components/EquipmentForm';
import { useEquipments } from '@/modules/equipments/hooks/use-equipments';
import { useEquipmentCategories } from '@/modules/equipments/hooks/use-equipment-categories';
import { toast } from '@/components/feedback';

export default function NovoEquipamentoPage() {
  const router = useRouter();
  const { create } = useEquipments();
  const { data: categories } = useEquipmentCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Equipamento criado com sucesso');
      router.push('/app/equipamentos');
    }
    return ok;
  };

  return (
    <CrudPage title="Novo Equipamento" description="Cadastre um novo equipamento">
      <EquipmentForm categories={categories} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
