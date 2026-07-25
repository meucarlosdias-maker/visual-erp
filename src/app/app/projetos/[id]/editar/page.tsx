'use client';

import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { ProjectForm } from '@/modules/projects/components/ProjectForm';
import { useProject } from '@/modules/projects/hooks/use-project';
import { useProjects } from '@/modules/projects/hooks/use-projects';
import { toast } from '@/components/feedback';
import { LoadingLocal } from '@/components/feedback';

export default function EditarProjetoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: project, loading, error } = useProject(id);
  const { update } = useProjects();

  const handleSave = async (data: Record<string, unknown>) => {
    const ok = await update(id, data);
    if (ok) {
      toast.success('Projeto atualizado');
      router.push(`/app/projetos/${id}`);
    }
    return ok;
  };

  if (loading) {
    return <CrudPage title="Carregando..." description=""><LoadingLocal size={24} message="Carregando projeto..." /></CrudPage>;
  }

  if (error || !project) {
    return <CrudPage title="Projeto não encontrado" description=""><p className="text-sm text-muted-foreground">Projeto não encontrado.</p></CrudPage>;
  }

  return (
    <CrudPage title="Editar Projeto" description={`Editando: ${project.number}`}>
      <ProjectForm project={project} onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
