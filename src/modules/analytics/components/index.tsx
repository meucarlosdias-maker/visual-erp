'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, BarChart3, Download, Plus, Trash2, LineChart, PieChart, AreaChart, BarChart } from '@/constants/icons';
import type { DashboardData, SavedReportData, KpiCard, WidgetConfig, ChartType } from '@/core/analytics';
import type { MetricCategory } from '@/core/analytics';

const categoryLabels: Record<MetricCategory, string> = {
  commercial: 'Comercial',
  crm: 'CRM',
  projects: 'Projetos',
  production: 'Produção',
  financial: 'Financeiro',
  installation: 'Instalação',
  team: 'Equipe',
  clients: 'Clientes',
  general: 'Geral',
};

const chartIcons: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
  area: AreaChart,
  radar: BarChart3,
  funnel: TrendingDown,
  gauge: BarChart3,
  heatmap: BarChart3,
};

export function KpiCardView({ kpi }: { kpi: KpiCard }) {
  const TrendIcon = kpi.changeType === 'increase' ? TrendingUp : kpi.changeType === 'decrease' ? TrendingDown : Minus;
  const trendColor = kpi.higherIsBetter
    ? (kpi.changeType === 'increase' ? 'text-green-600' : kpi.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500')
    : (kpi.changeType === 'decrease' ? 'text-green-600' : kpi.changeType === 'increase' ? 'text-red-600' : 'text-gray-500');

  const changeValue = kpi.change;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
        <Badge variant="outline">{categoryLabels[kpi.category]}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {kpi.unit === 'BRL' ? `R$ ${kpi.value.toLocaleString('pt-BR')}` : kpi.unit === '%' ? `${kpi.value}%` : kpi.value}
        </div>
        {changeValue !== null && (
          <div className={`flex items-center gap-1 text-sm mt-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span>{changeValue.toFixed(1)}% vs mês anterior</span>
          </div>
        )}
        {kpi.achievement !== null && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Meta: {kpi.target}%</span>
              <span>{kpi.achievement}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(kpi.achievement, 100)}%` }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardCard({ dashboard, onDelete }: { dashboard: DashboardData; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{dashboard.name}</CardTitle>
          <Badge variant={dashboard.active ? 'default' : 'secondary'}>{dashboard.active ? 'Ativo' : 'Inativo'}</Badge>
        </div>
        {dashboard.description && <CardDescription>{dashboard.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{dashboard.widgets.length} widgets</span>
          <span>Layout: {dashboard.layout?.columns ?? 12} colunas</span>
        </div>
      </CardContent>
      <div className="px-6 pb-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onDelete(dashboard.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Remover
        </Button>
      </div>
    </Card>
  );
}

export function DashboardForm({ onSuccess }: { onSuccess: () => void }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-1" />
        Novo Dashboard
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo Dashboard</DialogTitle></DialogHeader>
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const data = new FormData(form);
          await DashboardService.create('company-1', {
            name: data.get('name') as string,
            description: (data.get('description') as string) || undefined,
            active: true,
          });
          onSuccess();
        }}>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input name="name" placeholder="Meu Dashboard" required />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input name="description" placeholder="Descrição opcional" />
          </div>
          <Button type="submit">Criar Dashboard</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { DashboardService } from '../services';

export function ReportCard({ report, onDelete }: { report: SavedReportData; onDelete: (id: string) => void }) {
  const ChartIcon = report.chartType ? chartIcons[report.chartType] : BarChart3;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {report.chartType && <ChartIcon className="h-5 w-5 text-muted-foreground" />}
          <div>
            <CardTitle className="text-base">{report.name}</CardTitle>
            {report.description && <CardDescription>{report.description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
        {report.module && <Badge variant="outline">{report.module}</Badge>}
        <span>{report.columns?.length ?? 0} colunas</span>
        {report.shared && <Badge>Compartilhado</Badge>}
      </CardContent>
      <div className="px-6 pb-4">
        <Button variant="ghost" size="sm" onClick={() => onDelete(report.id)}>
          <Trash2 className="h-4 w-4 mr-1" /> Remover
        </Button>
      </div>
    </Card>
  );
}

export function KpiGrid({ kpis, loading }: { kpis: KpiCard[]; loading: boolean }) {
  if (loading) return <p className="text-center py-12 text-muted-foreground">Carregando indicadores...</p>;
  if (kpis.length === 0) return <p className="text-center py-12 text-muted-foreground">Nenhum indicador disponível.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => <KpiCardView key={kpi.id} kpi={kpi} />)}
    </div>
  );
}

export function KpiFilterBar({
  category,
  onCategoryChange,
}: {
  category: MetricCategory | '';
  onCategoryChange: (v: MetricCategory | '') => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Select value={category} onValueChange={(v) => { const val = v as string; onCategoryChange(val === 'all' ? '' : val as MetricCategory); }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ExportButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <Button variant="outline" onClick={onClick} disabled={loading}>
      <Download className="h-4 w-4 mr-1" />
      {loading ? 'Exportando...' : 'Exportar'}
    </Button>
  );
}
