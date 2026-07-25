'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { MaterialForm } from '@/modules/materials/components/MaterialForm';
import { useMaterials } from '@/modules/materials/hooks/use-materials';
import { useMaterialCategories } from '@/modules/materials/hooks/use-material-categories';
import { toast } from '@/components/feedback';

export default function NovoMaterialPage() {
  const router = useRouter();
  const { create } = useMaterials();
  const { data: categories } = useMaterialCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Material criado com sucesso');
      router.push('/app/materiais');
    }
    return ok;
  };

  return (
    <CrudPage title="Novo Material" description="Cadastre um novo material">
      <MaterialForm categories={categories} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
