'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInput } from '@/components/shared/SearchInput';
import { FilterSelect } from '@/components/shared/filters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Truck } from '@/constants/icons';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { InstallationBadge } from '@/modules/installations/components/InstallationBadge';
import { INSTALLATION_STATUS_LABELS } from '@/modules/installations/validators';
import { useInstallations } from '@/modules/installations/hooks/use-installations';
import { toast } from '@/components/feedback';
import { useDeleteConfirm } from '@/hooks/use-confirm';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  ...Object.entries(INSTALLATION_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export default function InstalacoesPage() {
  const router = useRouter();
  const { data: installations, loading, remove } = useInstallations();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = useMemo(() => {
    let list = installations;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        i.number.toLowerCase().includes(q) ||
        i.address.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q),
      );
    }
    if (filterStatus) list = list.filter((i) => i.status === filterStatus);
    return list;
  }, [installations, search, filterStatus]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover instalação', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Instalação removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Instalações"
        description="Gerencie as instalações e entregas"
        actionNew={{ onClick: () => router.push('/app/instalacoes/novo') }}
        toolbar={
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por número, endereço..." className="w-72" />
        }
        filters={
          <FilterSelect value={filterStatus} onChange={setFilterStatus} options={STATUS_OPTIONS} placeholder="Status" />
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando instalações..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Truck className="h-12 w-12 text-muted-foreground" />} title="Nenhuma instalação encontrada" description="Crie uma nova instalação para começar." />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => (
                  <TableRow key={i.id} className="cursor-pointer" onClick={() => router.push(`/app/instalacoes/${i.id}`)}>
                    <TableCell className="text-sm font-mono">{i.number}</TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate">{i.projectId}</TableCell>
                    <TableCell><InstallationBadge status={i.status} /></TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{i.address || `${i.city || ''}${i.state ? ` - ${i.state}` : ''}` || '—'}</TableCell>
                    <TableCell className="text-sm">{i.contactName || '—'}</TableCell>
                    <TableCell className="text-sm">{i.scheduledDate ? i.scheduledDate.toLocaleDateString('pt-BR') : '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/app/instalacoes/${i.id}/editar`); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleRemove(i.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CrudPage>
      {DeleteDialog}
    </>
  );
}
