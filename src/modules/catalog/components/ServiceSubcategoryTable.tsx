'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';
import { Badge } from '@/components/ui/badge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, ListTree } from '@/constants/icons';
import type { ServiceSubcategory } from '../types';
import type { ServiceCategory } from '../types';

interface ServiceSubcategoryTableProps {
  subcategories: ServiceSubcategory[];
  categories: ServiceCategory[];
  loading: boolean;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ServiceSubcategoryTable({
  subcategories,
  categories,
  loading,
  onToggleActive,
  onRemove,
}: ServiceSubcategoryTableProps) {
  if (loading) return <LoadingLocal size={24} message="Carregando subcategorias..." />;

  if (!subcategories.length) {
    return (
      <EmptyState
        icon={<ListTree className="h-12 w-12 text-muted-foreground" />}
        title="Nenhuma subcategoria"
        description="Nenhuma subcategoria cadastrada."
      />
    );
  }

  const getCategoryName = (catId: string) => categories.find((c) => c.id === catId)?.name || '—';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="font-medium">{sub.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{getCategoryName(sub.categoryId)}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {sub.description || '—'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{sub.sortOrder}</TableCell>
              <TableCell>
                <ServiceCategoryBadge active={sub.active} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={sub.active ? 'Desativar' : 'Ativar'}
                    onClick={() => onToggleActive(sub.id)}
                  >
                    {sub.active ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <OctagonXIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Remover"
                    onClick={() => onRemove(sub.id)}
                  >
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
