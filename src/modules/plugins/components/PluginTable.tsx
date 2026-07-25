'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Puzzle, Play, Pause, Trash2 } from '@/constants/icons';
import type { PluginRecord } from '@/core/plugins';
import { PluginCategoryBadge } from './PluginCategoryBadge';

export function PluginTable({
  data,
  onToggle,
  onDelete,
  onView,
}: {
  data: PluginRecord[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Versão</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((plugin) => (
          <TableRow key={plugin.id} className="cursor-pointer" onClick={() => onView(plugin.id)}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Puzzle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{plugin.name}</p>
                  {plugin.description && (
                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{plugin.description}</p>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">v{plugin.version}</Badge>
            </TableCell>
            <TableCell>
              <PluginCategoryBadge category={plugin.category} />
            </TableCell>
            <TableCell>
              <Badge variant={plugin.enabled ? 'default' : 'secondary'}>
                {plugin.enabled ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onToggle(plugin.id)} title={plugin.enabled ? 'Desativar' : 'Ativar'}>
                  {plugin.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(plugin.id)} title="Remover">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
