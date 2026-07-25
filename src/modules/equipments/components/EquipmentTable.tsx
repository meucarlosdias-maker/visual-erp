'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentBadge } from './EquipmentBadge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, Wrench } from '@/constants/icons';
import { EQUIPMENT_COST_LABELS } from '../schemas/equipment-schema';
import type { Equipment } from '../types';

interface EquipmentTableProps {
  equipments: Equipment[];
  categories: { id: string; name: string }[];
  loading: boolean;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

export const EquipmentTable = memo(function EquipmentTable({ equipments, categories, loading, onToggleActive, onRemove }: EquipmentTableProps) {
  const router = useRouter();

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

  if (loading) return <LoadingLocal size={24} message="Carregando equipamentos..." />;

  if (!equipments.length) {
    return (
      <EmptyState
        icon={<Wrench className="h-12 w-12 text-muted-foreground" />}
        title="Nenhum equipamento"
        description="Nenhum equipamento cadastrado."
      />
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Patrimônio</TableHead>
            <TableHead>Tipo Custo</TableHead>
            <TableHead>Custo Hora</TableHead>
            <TableHead>Custo KM</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipments.map((eq) => (
            <TableRow key={eq.id} className="cursor-pointer" onClick={() => router.push(`/app/equipamentos/${eq.id}`)}>
              <TableCell>
                <Badge variant="outline" className="font-mono">{eq.code}</Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium">{eq.name}</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{categoryName(eq.categoryId)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{eq.brand || '—'}</TableCell>
              <TableCell className="text-sm font-mono text-muted-foreground">{eq.patrimonyNumber || '—'}</TableCell>
              <TableCell className="text-sm">{EQUIPMENT_COST_LABELS[eq.costType] || eq.costType}</TableCell>
              <TableCell className="text-sm">{eq.hourCost > 0 ? `R$ ${eq.hourCost.toFixed(2)}` : '—'}</TableCell>
              <TableCell className="text-sm">{eq.kmCost > 0 ? `R$ ${eq.kmCost.toFixed(2)}` : '—'}</TableCell>
              <TableCell>
                <EquipmentBadge active={eq.active} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" title={eq.active ? 'Desativar' : 'Ativar'} onClick={() => onToggleActive(eq.id)}>
                    {eq.active ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <OctagonXIcon className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Remover" onClick={() => onRemove(eq.id)}>
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
