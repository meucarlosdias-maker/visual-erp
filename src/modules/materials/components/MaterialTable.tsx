'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MaterialBadge } from './MaterialBadge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, Package } from '@/constants/icons';
import { UNIT_LABELS } from '../schemas/material-schema';
import type { Material } from '../types';

interface MaterialTableProps {
  materials: Material[];
  loading: boolean;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

export const MaterialTable = memo(function MaterialTable({ materials, loading, onToggleActive, onRemove }: MaterialTableProps) {
  const router = useRouter();

  if (loading) return <LoadingLocal size={24} message="Carregando materiais..." />;

  if (!materials.length) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12 text-muted-foreground" />}
        title="Nenhum material"
        description="Nenhum material cadastrado."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Preço sugerido</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((mat) => (
            <TableRow key={mat.id} className="cursor-pointer" onClick={() => router.push(`/app/materiais/${mat.id}`)}>
              <TableCell>
                <Badge variant="outline" className="font-mono">{mat.code}</Badge>
              </TableCell>
              <TableCell className="font-medium">{mat.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{UNIT_LABELS[mat.unit] || mat.unit}</TableCell>
              <TableCell className="text-sm">R$ {mat.cost.toFixed(2)}</TableCell>
              <TableCell className="text-sm">R$ {mat.salePrice.toFixed(2)}</TableCell>
              <TableCell className="text-sm">{mat.currentStock}</TableCell>
              <TableCell>
                <MaterialBadge active={mat.active} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" title={mat.active ? 'Desativar' : 'Ativar'} onClick={() => onToggleActive(mat.id)}>
                    {mat.active ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <OctagonXIcon className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Remover" onClick={() => onRemove(mat.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
