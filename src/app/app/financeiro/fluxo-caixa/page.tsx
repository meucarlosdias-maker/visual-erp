'use client';

import { useState, useMemo } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from '@/constants/icons';
import { useCashFlow } from '@/modules/financial/hooks/use-cash-flow';
import { CASH_FLOW_TYPE_LABELS, CASH_FLOW_TYPE_COLORS } from '@/modules/financial/validators';

function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function formatDate(d: Date | string) { return new Date(d).toLocaleDateString('pt-BR'); }

export default function FluxoCaixaPage() {
  const { data, summary, loading } = useCashFlow();
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = data;

    if (dateStart) {
      const start = new Date(dateStart);
      result = result.filter((e) => new Date(e.date) >= start);
    }
    if (dateEnd) {
      const end = new Date(dateEnd);
      end.setHours(23, 59, 59, 999);
      result = result.filter((e) => new Date(e.date) <= end);
    }
    if (typeFilter !== 'ALL') {
      result = result.filter((e) => e.type === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) =>
        e.description.toLowerCase().includes(q) ||
        e.origin.toLowerCase().includes(q),
      );
    }

    return result;
  }, [data, dateStart, dateEnd, typeFilter, search]);

  return (
    <CrudPage title="Fluxo de Caixa" description="Acompanhe as movimentações financeiras">
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600"><TrendingUp className="h-4 w-4" /> Entradas</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(summary.income)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600"><TrendingDown className="h-4 w-4" /> Saídas</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(summary.expense)}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /> Saldo</CardTitle></CardHeader>
              <CardContent><p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(summary.balance)}</p></CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="space-y-1">
              <Label className="text-xs">Período</Label>
              <div className="flex items-center gap-2">
                <Input type="date" className="w-36" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                <span className="text-muted-foreground">até</span>
                <Input type="date" className="w-36" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tipo</Label>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'ALL')}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="INCOME">Entradas</SelectItem>
                  <SelectItem value="EXPENSE">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Projeto</Label>
              <Input className="w-36" placeholder="Filtrar projeto" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Cliente</Label>
              <Input className="w-36" placeholder="Filtrar cliente" disabled />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Saldo após</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma movimentação.</TableCell></TableRow>
                ) : filtered.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{formatDate(entry.date)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${CASH_FLOW_TYPE_COLORS[entry.type] ?? ''}`}>
                        {CASH_FLOW_TYPE_LABELS[entry.type] ?? entry.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{entry.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.origin}</TableCell>
                    <TableCell className={`text-sm text-right font-medium ${entry.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-right">{formatCurrency(entry.balanceAfter)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </CrudPage>
  );
}
