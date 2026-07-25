'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { CatalogServiceForm } from '@/modules/catalog/components/CatalogServiceForm';
import { useServices } from '@/modules/catalog/hooks/use-services';
import { useCategories } from '@/modules/catalog/hooks/use-categories';
import { useSubcategories } from '@/modules/catalog/hooks/use-subcategories';
import { toast } from '@/components/feedback';

export default function NovoServicoPage() {
  const router = useRouter();
  const { create } = useServices();
  const { categories } = useCategories();
  const { data: subcategories } = useSubcategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Serviço criado com sucesso');
      router.push('/app/catalogo/servicos');
    }
    return ok;
  };

  return (
    <CrudPage title="Novo Serviço" description="Cadastre um novo serviço no catálogo">
      <CatalogServiceForm
        categories={categories}
        subcategories={subcategories}
        onSave={handleSave}
        onCancel={() => router.back()}
      />
    </CrudPage>
  );
}
