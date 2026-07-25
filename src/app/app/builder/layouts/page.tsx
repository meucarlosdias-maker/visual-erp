'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout, Trash2, Eye } from '@/constants/icons';
import { useBuilderEntities, useBuilderLayouts, deleteLayout, LayoutComponentBadge } from '@/modules/builder';

export default function BuilderLayoutsPage() {
  const { data: entities } = useBuilderEntities();
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const { data: layouts, loading, refetch } = useBuilderLayouts(selectedEntityId);
  const [viewingLayoutId, setViewingLayoutId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este layout?')) return;
    await deleteLayout(id);
    await refetch();
  };

  const viewingLayout = viewingLayoutId ? layouts.find((l) => l.id === viewingLayoutId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Layouts</h1>
          <p className="text-sm text-muted-foreground">Layouts visuais para formulários</p>
        </div>
      </div>

      <div className="max-w-xs">
          <Select value={selectedEntityId} onValueChange={(v) => { setSelectedEntityId(v ?? ''); setViewingLayoutId(null); }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma entidade..." />
          </SelectTrigger>
          <SelectContent>
            {entities.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedEntityId && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Layout className="h-12 w-12 mb-3 opacity-50" />
          <p>Selecione uma entidade para ver seus layouts</p>
        </div>
      )}

      {selectedEntityId && loading && (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      )}

      {selectedEntityId && !loading && layouts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">Nenhum layout encontrado para esta entidade.</div>
      )}

      {selectedEntityId && !loading && layouts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {layouts.map((layout) => (
            <Card key={layout.id} className={layout.active ? 'ring-1 ring-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{layout.name}</CardTitle>
                    <Badge variant={layout.active ? 'default' : 'secondary'} className="text-[10px]">
                      v{layout.version}
                    </Badge>
                    {layout.active && <Badge className="text-[10px] bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setViewingLayoutId(layout.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(layout.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {layout.layout.map((comp) => (
                    <LayoutComponentBadge key={comp.id} type={comp.type} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewingLayout && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Visualização: {viewingLayout.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(viewingLayout.layout, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
