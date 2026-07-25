'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { pricingEngine, formatCurrency } from '@/core/engines/pricing';
import { Calculator, BarChart3, DollarSign, TrendingUp, Loader2, CheckCircle2, Clock, AlertTriangle } from '@/constants/icons';
import type { PricingResult, PricingLogEntry } from '@/core/engines/pricing';

const MOCK_SERVICES = [
  { id: 'svc-001', name: 'Instalação de Lona Oléfina' },
  { id: 'svc-002', name: 'Aplicação de Adesivo Vinílico' },
  { id: 'svc-003', name: 'Impressão Digital em ACM' },
];

const MOCK_COMPONENT_OPTIONS = [
  { value: 'mat-001', label: 'Vinil' },
  { value: 'mat-002', label: 'Lona Oléfina' },
  { value: 'mat-003', label: 'Adesivo Vinílico' },
  { value: 'lab-001', label: 'Mão de obra instalação' },
  { value: 'lab-002', label: 'Mão de obra produção' },
  { value: 'eq-001', label: 'Impressão digital' },
  { value: 'eq-002', label: 'Corte a laser' },
  { value: 'out-001', label: 'Acabamento terceirizado' },
  { value: 'out-002', label: 'Serviço de galvanização' },
  { value: 'trp-001', label: 'Frete entrega' },
  { value: 'trp-002', label: 'Frete coleta' },
];

const DEFAULT_COMPONENTS = ['mat-001', 'mat-003', 'lab-001', 'eq-001', 'out-001', 'trp-001'];

export default function PricingEnginePage() {
  const [serviceId, setServiceId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [selectedComponents, setSelectedComponents] = useState<string[]>(DEFAULT_COMPONENTS);
  const [result, setResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<PricingLogEntry[]>([]);

  const handleServiceChange = useCallback((value: string | null) => {
    if (value === null) return;
    setServiceId(value);
    const svc = MOCK_SERVICES.find((s) => s.id === value);
    setServiceName(svc?.name ?? '');
  }, []);

  const setVar = useCallback((key: string, value: string) => {
    const num = value === '' ? 0 : Number(value);
    setVariables((prev) => ({ ...prev, [key]: num }));
  }, []);

  const toggleComponent = useCallback((id: string) => {
    setSelectedComponents((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }, []);

  const handleExecute = useCallback(async () => {
    if (!serviceId) return;
    setLoading(true);
    const start = performance.now();
    const logEntry: PricingLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      executionTimeMs: 0,
      serviceId,
      componentsExecuted: [...selectedComponents],
      errors: [],
      warnings: [],
      success: false,
    };
    try {
      const res = await pricingEngine.calculate({
        serviceId,
        companyId: '00000000-0000-0000-0000-000000000000',
        quantity,
        variables,
        selectedComponents,
      });
      setResult(res);
      logEntry.success = true;
      logEntry.executionTimeMs = performance.now() - start;
    } catch (err) {
      logEntry.success = false;
      logEntry.executionTimeMs = performance.now() - start;
      logEntry.errors = [err instanceof Error ? err.message : 'Erro desconhecido'];
    } finally {
      setLoading(false);
      setLogs((prev) => [logEntry, ...prev].slice(0, 50));
    }
  }, [serviceId, quantity, variables, selectedComponents]);

  const statsCards = [
    { title: 'Total de Simulações', value: logs.length, icon: Calculator },
    { title: 'Custo Médio', value: logs.filter((l) => l.success).length > 0 ? 'R$ 1.234,56' : 'R$ 0,00', icon: DollarSign },
    { title: 'Ticket Médio', value: logs.filter((l) => l.success).length > 0 ? 'R$ 2.468,12' : 'R$ 0,00', icon: TrendingUp },
    { title: 'Margem Média', value: logs.filter((l) => l.success).length > 0 ? '32%' : '0%', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Motor de Precificação
        </h1>
        <p className="text-sm text-muted-foreground">
          Teste do Pricing Engine v1 — sem persistência
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parâmetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service">Serviço</Label>
              <Select value={serviceId} onValueChange={handleServiceChange}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SERVICES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade Base</Label>
              <Input id="quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label>Variáveis (CPS)</Label>
              <div className="grid grid-cols-2 gap-2">
                {['area', 'quantidade', 'horas', 'quilometros'].map((key) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs capitalize">{key}</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.1}
                      placeholder="0"
                      value={variables[key] ?? ''}
                      onChange={(e) => setVar(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['impostos', 'margem'].map((key) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs capitalize">{key} (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      placeholder="0"
                      value={variables[key] ?? ''}
                      onChange={(e) => setVar(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Componentes</Label>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_COMPONENT_OPTIONS.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant={selectedComponents.includes(opt.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleComponent(opt.value)}
                  >
                    {opt.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handleExecute} disabled={!serviceId || loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
              {loading ? 'Calculando...' : 'Executar Cálculo'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Selecione um serviço e execute o cálculo.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Subtotal</p>
                    <p className="text-lg font-bold">{formatCurrency(result.subtotal)}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Margem</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(result.margin)}</p>
                  </div>
                  <div className="rounded-lg border p-3 col-span-2 bg-primary/5">
                    <p className="text-xs text-muted-foreground">Preço Final</p>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(result.salePrice)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Detalhamento</p>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Componente</TableHead>
                          <TableHead>Qtd</TableHead>
                          <TableHead>Un</TableHead>
                          <TableHead>Custo Un.</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.details.map((d) => (
                          <TableRow key={d.componentId}>
                            <TableCell className="text-sm">{d.componentName}</TableCell>
                            <TableCell className="text-sm">{d.quantity}</TableCell>
                            <TableCell className="text-sm">{d.unit}</TableCell>
                            <TableCell className="text-sm">{formatCurrency(d.unitCost)}</TableCell>
                            <TableCell className="text-sm font-medium">{formatCurrency(d.totalCost)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-medium">
                          <TableCell colSpan={4} className="text-sm">Subtotal</TableCell>
                          <TableCell className="text-sm">{formatCurrency(result.subtotal)}</TableCell>
                        </TableRow>
                        <TableRow className="font-medium">
                          <TableCell colSpan={4} className="text-sm">Margem ({variables.margem ?? 0}%)</TableCell>
                          <TableCell className="text-sm text-green-600">{formatCurrency(result.margin)}</TableCell>
                        </TableRow>
                        <TableRow className="font-bold">
                          <TableCell colSpan={4} className="text-sm">Preço Final</TableCell>
                          <TableCell className="text-sm text-primary">{formatCurrency(result.salePrice)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded bg-muted/30 p-2">
                    <p className="text-muted-foreground">Materiais</p>
                    <p className="font-medium">{formatCurrency(result.materialCost)}</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="text-muted-foreground">Mão de Obra</p>
                    <p className="font-medium">{formatCurrency(result.laborCost)}</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="text-muted-foreground">Equipamentos</p>
                    <p className="font-medium">{formatCurrency(result.equipmentCost)}</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="text-muted-foreground">Terceiros</p>
                    <p className="font-medium">{formatCurrency(result.outsourcedCost)}</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="text-muted-foreground">Frete</p>
                    <p className="font-medium">{formatCurrency(result.transportCost)}</p>
                  </div>
                  <div className="rounded bg-muted/30 p-2">
                    <p className="text-muted-foreground">Impostos</p>
                    <p className="font-medium">{formatCurrency(result.taxCost)}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Logs de Execução ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma execução registrada.
            </p>
          ) : (
            <div className="rounded-md border overflow-x-auto max-h-60 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Componentes</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Erros</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.success
                          ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                          : <AlertTriangle className="h-4 w-4 text-destructive" />
                        }
                      </TableCell>
                      <TableCell className="text-sm font-mono">{log.serviceId}</TableCell>
                      <TableCell className="text-sm">{log.componentsExecuted.length} itens</TableCell>
                      <TableCell className="text-sm">{log.executionTimeMs.toFixed(1)}ms</TableCell>
                      <TableCell className="text-sm text-destructive">{log.errors.join(', ') || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
