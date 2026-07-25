'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInput } from '@/components/shared/SearchInput';
import { FilterSelect, FilterDate, FilterText } from '@/components/shared/filters';
import { useQuotations } from '@/modules/quotations/hooks/use-quotations';
import { QuotationTable } from '@/modules/quotations/components/QuotationTable';
import { QuotationStatsCards } from '@/modules/quotations/components/QuotationStatsCards';
import { QUOTATION_STATUS_LABELS } from '@/modules/quotations/validators';
import { toast } from '@/components/feedback';
import { useDeleteConfirm } from '@/hooks/use-confirm';

const STATUS_OPTIONS = [
  { value: '', label: 'Todas' },
  ...Object.entries(QUOTATION_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export default function OrcamentosPage() {
  const router = useRouter();
  const { data: quotations, loading, delete: remove } = useQuotations();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const [search, setSearch] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPeriodStart, setFilterPeriodStart] = useState('');
  const [filterPeriodEnd, setFilterPeriodEnd] = useState('');
  const [filterNumber, setFilterNumber] = useState('');

  const filtered = useMemo(() => {
    let list = quotations;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (orc) =>
          orc.number.toLowerCase().includes(q) ||
          orc.title.toLowerCase().includes(q) ||
          (orc.clientId ?? '').toLowerCase().includes(q),
      );
    }

    if (filterClient) {
      list = list.filter((orc) => (orc.clientId ?? '').toLowerCase().includes(filterClient.toLowerCase()));
    }

    if (filterStatus) {
      list = list.filter((orc) => orc.status === filterStatus);
    }

    if (filterNumber) {
      list = list.filter((orc) => orc.number.toLowerCase().includes(filterNumber.toLowerCase()));
    }

    if (filterPeriodStart) {
      const start = new Date(filterPeriodStart);
      list = list.filter((orc) => orc.updatedAt >= start);
    }

    if (filterPeriodEnd) {
      const end = new Date(filterPeriodEnd);
      end.setHours(23, 59, 59, 999);
      list = list.filter((orc) => orc.updatedAt <= end);
    }

    return list;
  }, [quotations, search, filterClient, filterStatus, filterNumber, filterPeriodStart, filterPeriodEnd]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover orçamento',
      description: 'Esta ação não pode ser desfelta.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Orçamento removido');
  }, [confirmDelete, remove]);

  const filters = (
    <>
      <FilterText
        value={filterClient}
        onChange={setFilterClient}
        placeholder="Cliente..."
      />
      <FilterSelect
        value={filterStatus}
        onChange={setFilterStatus}
        options={STATUS_OPTIONS}
        placeholder="Status"
      />
      <FilterDate
        value={filterPeriodStart}
        onChange={setFilterPeriodStart}
      />
      <FilterDate
        value={filterPeriodEnd}
        onChange={setFilterPeriodEnd}
      />
      <FilterText
        value={filterNumber}
        onChange={setFilterNumber}
        placeholder="Nº..."
      />
    </>
  );

  return (
    <>
      <CrudPage
        title="Orçamentos"
        description="Gerencie os orçamentos comerciais"
        actionNew={{ onClick: () => router.push('/app/orcamentos/novo') }}
        filters={filters}
        toolbar={
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por número, título ou cliente..."
            className="w-72"
          />
        }
        summary={<QuotationStatsCards quotations={filtered} loading={loading} />}
      >
        <QuotationTable
          quotations={filtered}
          loading={loading}
          onRemove={handleRemove}
        />
      </CrudPage>

      {DeleteDialog}
    </>
  );
}
