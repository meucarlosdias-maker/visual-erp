'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { ServiceSubcategoryForm } from '@/modules/catalog/components/ServiceSubcategoryForm';
import { useSubcategories } from '@/modules/catalog/hooks/use-subcategories';
import { useCategories } from '@/modules/catalog/hooks/use-categories';
import { toast } from '@/components/feedback';

export default function NovaSubcategoriaPage() {
  const router = useRouter();
  const { create } = useSubcategories();
  const { categories } = useCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Subcategoria criada com sucesso');
      router.push('/app/catalogo/subcategorias');
    }
    return ok;
  };

  return (
    <CrudPage title="Nova Subcategoria" description="Cadastre uma nova subcategoria de serviço">
      <ServiceSubcategoryForm categories={categories} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
