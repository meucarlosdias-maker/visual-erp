'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from '@/constants/icons';
import { LeadStatusBadge, TemperatureBadge } from './LeadBadge';
import type { Lead, LeadStatus, LeadTemperature } from '../types';

interface LeadTableProps {
  data: Lead[];
  onRowClick: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

export function LeadTable({ data, onRowClick, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Temp.</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Criação</TableHead>
            <TableHead className="w-20">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Nenhum lead encontrado.</TableCell></TableRow>
          ) : data.map((lead) => (
            <TableRow key={lead.id} className="cursor-pointer" onClick={() => onRowClick(lead.id)}>
              <TableCell className="text-sm font-mono">{lead.number}</TableCell>
              <TableCell className="text-sm font-medium">{lead.contactName}</TableCell>
              <TableCell><LeadStatusBadge status={lead.status as LeadStatus} /></TableCell>
              <TableCell><TemperatureBadge temperature={lead.temperature as LeadTemperature} /></TableCell>
              <TableCell className="text-sm max-w-[160px] truncate">{lead.companyName || '—'}</TableCell>
              <TableCell className="text-sm">{lead.city || '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{lead.assignedUserId || '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(lead.id); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
