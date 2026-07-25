'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInput } from '@/components/shared/SearchInput';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Truck, CheckCircle2 } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { InstallationBadge } from '@/modules/installations/components/InstallationBadge';
import { useInstallations } from '@/modules/installations/hooks/use-installations';

export default function EntregasPage() {
  const router = useRouter();
  const { data: allInstallations, loading, updateStatus } = useInstallations();
  const [search, setSearch] = useState('');

  const installations = useMemo(() => {
    return allInstallations.filter((i) => i.status === 'FINISHED' || i.status === 'DELIVERED' || i.status === 'ON_ROUTE' || i.status === 'IN_PROGRESS');
  }, [allInstallations]);

  const filtered = useMemo(() => {
    if (!search) return installations;
    const q = search.toLowerCase();
    return installations.filter((i) =>
      i.number.toLowerCase().includes(q) ||
      i.address.toLowerCase().includes(q) ||
      i.contactName.toLowerCase().includes(q),
    );
  }, [installations, search]);

  const handleFinishDelivery = useCallback(async (id: string) => {
    const ok = await updateStatus(id, 'DELIVERED');
    if (ok) toast.success('Entrega registrada com sucesso');
    else toast.error('Erro ao registrar entrega');
  }, [updateStatus]);

  const pendingCount = useMemo(() => installations.filter((i) => i.status !== 'DELIVERED').length, [installations]);

  return (
    <CrudPage
      title="Entregas"
      description={pendingCount > 0 ? `${pendingCount} entrega(s) pendente(s)` : 'Todas as entregas realizadas'}
      toolbar={
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por número, endereço..." className="w-72" />
      }
    >
      {loading ? (
        <LoadingLocal message="Carregando entregas..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Truck className="h-12 w-12 text-muted-foreground" />} title="Nenhuma entrega encontrada" description="As entregas aparecerão aqui quando as instalações forem concluídas." />
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Agendamento</TableHead>
                <TableHead className="w-28">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id} className="cursor-pointer" onClick={() => router.push(`/app/instalacoes/${i.id}`)}>
                  <TableCell className="text-sm font-mono">{i.number}</TableCell>
                  <TableCell><InstallationBadge status={i.status} /></TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{i.address || i.city || '—'}</TableCell>
                  <TableCell className="text-sm">{i.contactName || '—'}</TableCell>
                  <TableCell className="text-sm">{i.scheduledDate ? i.scheduledDate.toLocaleDateString('pt-BR') : '—'}</TableCell>
                  <TableCell>
                    {i.status !== 'DELIVERED' && (
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleFinishDelivery(i.id); }}>
                        <CheckCircle2 className="mr-1 h-4 w-4" /> Entregar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CrudPage>
  );
}
