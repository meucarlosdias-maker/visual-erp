'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInput } from '@/components/shared/SearchInput';
import { FilterSelect, FilterText } from '@/components/shared/filters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, FolderKanban } from '@/constants/icons';
import { EmptyState, LoadingLocal } from '@/components/feedback';
import { ProjectBadge } from '@/modules/projects/components/ProjectBadge';
import { PRIORITY_LABELS, PROJECT_STATUS_LABELS } from '@/modules/projects/validators';
import { useProjects } from '@/modules/projects/hooks/use-projects';
import { toast } from '@/components/feedback';
import { useDeleteConfirm } from '@/hooks/use-confirm';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  ...Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export default function ProjetosPage() {
  const router = useRouter();
  const { data: projects, loading, delete: remove } = useProjects();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const filtered = useMemo(() => {
    let list = projects;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.number.toLowerCase().includes(q),
      );
    }
    if (filterStatus) list = list.filter((p) => p.status === filterStatus);
    if (filterPriority) list = list.filter((p) => p.priority === filterPriority);
    return list;
  }, [projects, search, filterStatus, filterPriority]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover projeto', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Projeto removido');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Projetos"
        description="Gerencie os projetos de produção"
        actionNew={{ onClick: () => router.push('/app/projetos/novo') }}
        toolbar={
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou número..." className="w-72" />
        }
        filters={
          <>
            <FilterSelect value={filterStatus} onChange={setFilterStatus} options={STATUS_OPTIONS} placeholder="Status" />
            <FilterText value={filterPriority} onChange={setFilterPriority} placeholder="Prioridade..." />
          </>
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando projetos..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FolderKanban className="h-12 w-12 text-muted-foreground" />} title="Nenhum projeto encontrado" description="Crie um novo projeto para começar." />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Início Prev.</TableHead>
                  <TableHead>Término Prev.</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => router.push(`/app/projetos/${p.id}`)}>
                    <TableCell className="text-sm font-mono">{p.number}</TableCell>
                    <TableCell className="text-sm font-medium max-w-[250px] truncate">{p.name}</TableCell>
                    <TableCell><ProjectBadge status={p.status} /></TableCell>
                    <TableCell className="text-sm">{PRIORITY_LABELS[p.priority] ?? p.priority}</TableCell>
                    <TableCell className="text-sm">{p.expectedStartDate ? p.expectedStartDate.toLocaleDateString('pt-BR') : '—'}</TableCell>
                    <TableCell className="text-sm">{p.expectedEndDate ? p.expectedEndDate.toLocaleDateString('pt-BR') : '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/app/projetos/${p.id}/editar`); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleRemove(p.id); }}>
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
