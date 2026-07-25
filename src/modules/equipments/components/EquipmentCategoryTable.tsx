'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EquipmentCategoryBadge } from './EquipmentCategoryBadge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, FolderKanban } from '@/constants/icons';
import type { EquipmentCategory } from '../types';

interface EquipmentCategoryTableProps {
  categories: EquipmentCategory[];
  loading: boolean;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

export function EquipmentCategoryTable({ categories, loading, onToggleActive, onRemove }: EquipmentCategoryTableProps) {
  if (loading) return <LoadingLocal size={24} message="Carregando categorias..." />;

  if (!categories.length) {
    return (
      <EmptyState
        icon={<FolderKanban className="h-12 w-12 text-muted-foreground" />}
        title="Nenhuma categoria"
        description="Nenhuma categoria de equipamento cadastrada."
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: cat.color || '#6b7280' }}
                  >
                    {cat.name[0].toUpperCase()}
                  </span>
                  <span className="font-medium">{cat.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{cat.sortOrder}</TableCell>
              <TableCell>
                <EquipmentCategoryBadge active={cat.active} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" title={cat.active ? 'Desativar' : 'Ativar'} onClick={() => onToggleActive(cat.id)}>
                    {cat.active ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <OctagonXIcon className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Remover" onClick={() => onRemove(cat.id)}>
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
}
