'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { ProjectForm } from '@/modules/projects/components/ProjectForm';
import { useProjects } from '@/modules/projects/hooks/use-projects';
import { toast } from '@/components/feedback';

export default function NovoProjetoPage() {
  const router = useRouter();
  const { create } = useProjects();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await create(data);
    if (ok) {
      toast.success('Projeto criado com sucesso');
      router.push('/app/projetos');
    }
    return ok;
  };

  return (
    <CrudPage title="Novo Projeto" description="Crie um novo projeto de produção">
      <ProjectForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
