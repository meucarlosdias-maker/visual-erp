'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { MaterialForm } from '@/modules/materials/components/MaterialForm';
import { useMaterial } from '@/modules/materials/hooks/use-material';
import { useMaterialCategories } from '@/modules/materials/hooks/use-material-categories';
import { toast } from '@/components/feedback';
import { LoadingLocal } from '@/components/feedback';

export default function EditarMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: material, loading, error, update } = useMaterial(id);
  const { data: categories } = useMaterialCategories();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await update(data);
    if (ok) {
      toast.success('Material atualizado com sucesso');
      router.push('/app/materiais');
    }
    return ok;
  };

  if (loading) return <CrudPage title="Carregando..." description=""><LoadingLocal size={24} message="Carregando material..." /></CrudPage>;
  if (error || !material) return <CrudPage title="Material não encontrado" description=""><p className="text-sm text-muted-foreground">Material não encontrado.</p></CrudPage>;

  return (
    <CrudPage title="Editar Material" description={`Editando: ${material.name}`}>
      <MaterialForm material={material} categories={categories} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
