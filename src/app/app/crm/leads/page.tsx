'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Input } from '@/components/ui/input';
import { Search, Users } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { LeadTable } from '@/modules/crm/components/LeadTable';
import { useLeads } from '@/modules/crm/hooks/use-leads';
import { useDeleteConfirm } from '@/hooks/use-confirm';

export default function CrmPage() {
  const router = useRouter();
  const { data, loading, delete: remove } = useLeads();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((l) =>
      l.number.toLowerCase().includes(q) ||
      l.contactName.toLowerCase().includes(q) ||
      l.companyName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q),
    );
  }, [data, search]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({ title: 'Remover lead', description: 'Esta ação não pode ser desfeita.' });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Lead removido');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Leads"
        description="Gerencie seus leads e oportunidades comerciais"
        actionNew={{ onClick: () => router.push('/app/crm/leads/novo') }}
        toolbar={
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 w-64" placeholder="Buscar leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      >
        {loading ? (
          <LoadingLocal message="Carregando leads..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Users className="h-12 w-12 text-muted-foreground" />} title="Nenhum lead" description="Cadastre um novo lead para começar." />
        ) : (
          <LeadTable
            data={filtered}
            onRowClick={(id) => router.push(`/app/crm/leads/${id}`)}
            onEdit={(id) => router.push(`/app/crm/leads/${id}`)}
            onDelete={handleDelete}
          />
        )}
      </CrudPage>
      {DeleteDialog}
    </>
  );
}
