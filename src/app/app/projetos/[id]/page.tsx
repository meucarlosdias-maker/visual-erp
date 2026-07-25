'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { useProject } from '@/modules/projects/hooks/use-project';
import { LoadingLocal } from '@/components/feedback';
import { toast } from '@/components/feedback';

const ProjectDetail = dynamic(() =>
  import('@/modules/projects/components/ProjectDetail').then((mod) => ({ default: mod.ProjectDetail })),
);

export default function ProjetoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { data: project, loading, updateStatus } = useProject(id);

  const handleUpdateStatus = async (status: string) => {
    const ok = await updateStatus(status);
    if (ok) toast.success('Status atualizado');
  };

  return (
    <CrudPage title="" description="">
      <Suspense fallback={<LoadingLocal />}>
        <ProjectDetail
          project={project}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          onBack={() => router.push('/app/projetos')}
        />
      </Suspense>
    </CrudPage>
  );
}
