'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { MaterialCategoryForm } from '@/modules/materials/components/MaterialCategoryForm';
import { useMaterialCategories } from '@/modules/materials/hooks/use-material-categories';
import { toast } from '@/components/feedback';

export default function NovaCategoriaMaterialPage() {
  const router = useRouter();
  const { create } = useMaterialCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Categoria criada com sucesso');
      router.push('/app/materiais/categorias');
    }
    return ok;
  };

  return (
    <CrudPage title="Nova Categoria de Material" description="Cadastre uma nova categoria de material">
      <MaterialCategoryForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
