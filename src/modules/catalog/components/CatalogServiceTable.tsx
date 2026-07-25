'use client';

import { memo } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';
import { Badge } from '@/components/ui/badge';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { Trash2, CheckCircle2, OctagonXIcon, Package } from '@/constants/icons';
import type { CatalogService } from '../types';

interface CatalogServiceTableProps {
  services: CatalogService[];
  loading: boolean;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

export const CatalogServiceTable = memo(function CatalogServiceTable({
  services,
  loading,
  onToggleActive,
  onRemove,
}: CatalogServiceTableProps) {
  if (loading) return <LoadingLocal size={24} message="Carregando serviços..." />;

  if (!services.length) {
    return (
      <EmptyState
        icon={<Package className="h-12 w-12 text-muted-foreground" />}
        title="Nenhum serviço"
        description="Nenhum serviço cadastrado no catálogo."
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
            <TableHead>Descrição</TableHead>
            <TableHead>Versão</TableHead>
            <TableHead>Margem Padrão</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((svc) => (
            <TableRow key={svc.id}>
              <TableCell>
                <Badge variant="outline" className="font-mono">{svc.code}</Badge>
              </TableCell>
              <TableCell className="font-medium">{svc.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {svc.description || '—'}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{svc.version}</TableCell>
              <TableCell className="text-sm">{svc.defaultMargin}%</TableCell>
              <TableCell>
                <ServiceCategoryBadge active={svc.active} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={svc.active ? 'Desativar' : 'Ativar'}
                    onClick={() => onToggleActive(svc.id)}
                  >
                    {svc.active ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <OctagonXIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Remover"
                    onClick={() => onRemove(svc.id)}
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
});
