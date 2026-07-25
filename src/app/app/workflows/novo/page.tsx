'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { WorkflowForm } from '@/modules/workflows/components';

export default function NovoWorkflowPage() {
  const router = useRouter();

  return (
    <CrudPage
      title="Novo Workflow"
      description="Crie uma nova automação de processo"
    >
      <WorkflowForm onSuccess={() => router.push('/app/workflows')} />
    </CrudPage>
  );
}
