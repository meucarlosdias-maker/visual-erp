'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { ServiceCategoryForm } from '@/modules/catalog/components/ServiceCategoryForm';
import { useCategories } from '@/modules/catalog/hooks/use-categories';
import { toast } from '@/components/feedback';

export default function NovaCategoriaPage() {
  const router = useRouter();
  const { create } = useCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Categoria criada com sucesso');
      router.push('/app/catalogo/categorias');
    }
    return ok;
  };

  return (
    <CrudPage title="Nova Categoria" description="Cadastre uma nova categoria de serviço">
      <ServiceCategoryForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
