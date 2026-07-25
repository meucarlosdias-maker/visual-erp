'use client';

import { use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingLocal, toast } from '@/components/feedback';
import {
  Puzzle,
  ArrowLeft,
  Play,
  Pause,
  Trash2,
} from '@/constants/icons';
import { ExecutionTable } from '@/modules/plugins/components';
import { usePlugin, usePluginExecutions } from '@/modules/plugins/hooks';
import { LifecycleService } from '@/modules/plugins/services';

export default function PluginDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { plugin, loading } = usePlugin(id);
  const { executions } = usePluginExecutions(id);

  const handleToggle = useCallback(async () => {
    if (!plugin) return;
    const updated = plugin.enabled
      ? await LifecycleService.disable(id)
      : await LifecycleService.enable(id);
    if (updated) {
      toast.success(updated.enabled ? 'Plugin ativado' : 'Plugin desativado');
      router.refresh();
    } else {
      toast.error('Erro ao alterar status');
    }
  }, [plugin, id, router]);

  const handleRemove = useCallback(async () => {
    const ok = await LifecycleService.remove(id);
    if (ok) {
      toast.success('Plugin removido');
      router.push('/app/plugins/instalados');
    } else {
      toast.error('Erro ao remover plugin');
    }
  }, [id, router]);

  if (loading) return <LoadingLocal message="Carregando plugin..." />;
  if (!plugin) return <p className="text-center py-12 text-muted-foreground">Plugin não encontrado.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/app/plugins/instalados')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Puzzle className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{plugin.name}</h1>
            <Badge variant="outline">v{plugin.version}</Badge>
            <Badge variant={plugin.enabled ? 'default' : 'secondary'}>
              {plugin.enabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          {plugin.description && (
            <p className="text-sm text-muted-foreground">{plugin.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggle}>
            {plugin.enabled ? <><Pause className="h-4 w-4 mr-1" /> Desativar</> : <><Play className="h-4 w-4 mr-1" /> Ativar</>}
          </Button>
          <Button variant="destructive" onClick={handleRemove}>
            <Trash2 className="h-4 w-4 mr-1" /> Remover
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Autor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{plugin.author ?? '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium capitalize">{plugin.category}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Slug</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-mono text-sm">{plugin.slug}</p>
          </CardContent>
        </Card>
      </div>

      {plugin.manifest && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Permissões do Manifesto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plugin.manifest.permissions.length === 0 ? (
                <span className="text-sm text-muted-foreground">Nenhuma permissão declarada</span>
              ) : (
                plugin.manifest.permissions.map((perm: string) => (
                  <Badge key={perm} variant="secondary">{perm}</Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {plugin.manifest && plugin.manifest.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Eventos Ouvidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plugin.manifest.events.map((evt: string) => (
                <Badge key={evt} variant="outline">{evt}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Execuções</CardTitle>
        </CardHeader>
        <CardContent>
          <ExecutionTable data={executions} />
        </CardContent>
      </Card>
    </div>
  );
}
