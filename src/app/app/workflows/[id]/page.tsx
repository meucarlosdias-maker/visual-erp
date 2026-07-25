'use client';

import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWorkflow, useExecutions } from '@/modules/workflows/hooks';
import { ExecutionTable } from '@/modules/workflows/components';

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: workflow, loading: wfLoading, refetch: refetchWf } = useWorkflow(id);
  const { data: executions, loading: execLoading, executeWorkflow, refetch: refetchExec } = useExecutions();

  const handleExecute = useCallback(async () => {
    if (!workflow) return;
    const ok = await executeWorkflow(workflow.id, {});
    if (ok) {
      toast.success('Workflow executado com sucesso');
      refetchExec();
    } else {
      toast.error('Erro ao executar workflow');
    }
  }, [workflow, executeWorkflow, refetchExec]);

  const workflowExecutions = executions.filter((e) => e.workflowId === id);

  if (wfLoading) return <LoadingLocal message="Carregando workflow..." />;
  if (!workflow) return <p className="text-center py-12 text-muted-foreground">Workflow não encontrado.</p>;

  return (
    <CrudPage
      title={workflow.name}
      description={workflow.description ?? 'Sem descrição'}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Gatilho</CardTitle></CardHeader>
          <CardContent>
            <Badge variant="outline" className="font-mono">{workflow.trigger}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
          <CardContent>
            <Badge variant={workflow.active ? 'default' : 'secondary'}>
              {workflow.active ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Passos</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{workflow.steps.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleExecute} disabled={execLoading}>
          {execLoading ? 'Executando...' : 'Executar Workflow'}
        </Button>
        <Button variant="outline" onClick={() => router.push('/app/workflows')}>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Passos do Workflow</h2>
        {workflow.steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum passo configurado.</p>
        ) : (
          <div className="space-y-2">
            {workflow.steps.map((step, i) => (
              <Card key={step.id}>
                <CardContent className="flex items-center gap-4 py-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <Badge variant="outline">{step.type}</Badge>
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {(step.configuration as Record<string, unknown>).actionType as string ?? 'Ação'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Execuções</h2>
        {execLoading ? (
          <LoadingLocal message="Carregando execuções..." />
        ) : workflowExecutions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma execução ainda.</p>
        ) : (
          <ExecutionTable data={workflowExecutions} />
        )}
      </div>
    </CrudPage>
  );
}
