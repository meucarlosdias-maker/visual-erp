'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formulaService } from '@/core/engines/formula';
import { Calculator, CheckCircle2, Clock, AlertTriangle, ListTree, Loader2 } from '@/constants/icons';
import type { FormulaResult, ASTNode, FormulaLogEntry } from '@/core/engines/formula';

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}µs`;
  return `${ms.toFixed(2)}ms`;
}

function renderAST(node: ASTNode, depth = 0): string {
  const pad = '  '.repeat(depth);
  switch (node.type) {
    case 'LiteralNode':
      return `${pad}LiteralNode { value: ${node.value} }`;
    case 'VariableNode':
      return `${pad}VariableNode { name: '${node.name}' }`;
    case 'BinaryOperationNode':
      return [
        `${pad}BinaryOperationNode {`,
        `${pad}  operator: '${node.operator}',`,
        `${pad}  left:`,
        renderAST(node.left, depth + 2),
        `${pad}  right:`,
        renderAST(node.right, depth + 2),
        `${pad}}`,
      ].join('\n');
    case 'UnaryOperationNode':
      return [
        `${pad}UnaryOperationNode {`,
        `${pad}  operator: '${node.operator}',`,
        `${pad}  operand:`,
        renderAST(node.operand, depth + 2),
        `${pad}}`,
      ].join('\n');
    case 'FunctionNode':
      return [
        `${pad}FunctionNode {`,
        `${pad}  name: '${node.name}',`,
        `${pad}  arguments: [`,
        ...node.arguments.map((arg) => renderAST(arg, depth + 2)),
        `${pad}  ]`,
        `${pad}}`,
      ].join('\n');
  }
}

const DEFAULT_VARIABLES_JSON = JSON.stringify({ largura: 5, altura: 3, area: 15, quantidade: 10 }, null, 2);

export default function FormulasPage() {
  const [expression, setExpression] = useState('');
  const [variablesJson, setVariablesJson] = useState(DEFAULT_VARIABLES_JSON);
  const [precision, setPrecision] = useState('');
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [ast, setAst] = useState<ASTNode | null>(null);
  const [astText, setAstText] = useState('');
  const [logs, setLogs] = useState<FormulaLogEntry[]>([]);
  const [executeCount, setExecuteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [parseError, setParseError] = useState('');

  const variables = useMemo(() => {
    try {
      const parsed = JSON.parse(variablesJson);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setParseError('Variables must be a JSON object');
        return {};
      }
      const coerced: Record<string, number> = {};
      for (const key of Object.keys(parsed)) {
        const val = Number(parsed[key]);
        if (isNaN(val)) {
          setParseError(`Value for '${key}' is not a number`);
          return {};
        }
        coerced[key] = val;
      }
      setParseError('');
      return coerced;
    } catch {
      setParseError('Invalid JSON');
      return {};
    }
  }, [variablesJson]);

  const handleExecute = useCallback(() => {
    if (!expression.trim()) return;
    setLoading(true);

    const request = {
      expression: expression.trim(),
      variables,
      precision: precision ? Number(precision) : undefined,
    };

    const { result: res, ast: parsedAst } = formulaService.calculate(request);

    setResult(res);
    setAst(parsedAst);
    setAstText(parsedAst ? renderAST(parsedAst) : '');
    setLogs(formulaService.getLogs());
    setExecuteCount((c) => c + 1);
    setLoading(false);
  }, [expression, variables, precision]);

  const statsCards = [
    { title: 'Execuções', value: executeCount, icon: Calculator },
    { title: 'Último Resultado', value: result?.value !== null && result?.value !== undefined ? result.value : '—', icon: CheckCircle2 },
    {
      title: 'Último Tempo',
      value: result ? formatTime(result.executionTime) : '—',
      icon: Clock,
    },
    {
      title: 'Últimos Erros',
      value: result && result.errors.length > 0 ? result.errors.length : 0,
      icon: ListTree,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Calculadora de Fórmulas
        </h1>
        <p className="text-sm text-muted-foreground">
          Teste do Formula Engine — parser, AST, executor
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
              <p className="text-2xl font-bold">{String(card.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entrada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expression">Expressão</Label>
              <Input
                id="expression"
                placeholder="Ex: largura * altura * 1.05 + taxa"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variables">Variáveis (JSON)</Label>
              <Textarea
                id="variables"
                className="font-mono text-sm min-h-[120px]"
                value={variablesJson}
                onChange={(e) => setVariablesJson(e.target.value)}
              />
              {parseError && (
                <p className="text-xs text-destructive">{parseError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="precision">Precisão (opcional)</Label>
              <Input
                id="precision"
                type="number"
                min={0}
                max={10}
                placeholder="Ex: 2"
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
              />
            </div>

            <Button
              onClick={handleExecute}
              disabled={!expression.trim() || !!parseError || loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Executando...' : 'Executar'}
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
                Digite uma expressão e execute.
              </p>
            ) : result.value !== null ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-primary/5 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Valor</p>
                  <p className="text-3xl font-bold text-primary">{result.value}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded border p-2">
                    <p className="text-xs text-muted-foreground">Tempo</p>
                    <p className="font-medium">{formatTime(result.executionTime)}</p>
                  </div>
                  <div className="rounded border p-2">
                    <p className="text-xs text-muted-foreground">Variáveis</p>
                    <p className="font-medium">{result.variablesUsed.join(', ') || '—'}</p>
                  </div>
                </div>
                {result.warnings.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Avisos</p>
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {w}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 py-4">
                {result.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
                {result.warnings.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <p className="text-xs font-medium text-muted-foreground">Avisos</p>
                    {result.warnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> {w}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {astText && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ListTree className="h-4 w-4" />
              AST
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-muted/30 rounded-md p-4 overflow-x-auto whitespace-pre">
              {astText}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Logs ({logs.length})
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
                    <TableHead>Expressão</TableHead>
                    <TableHead>Tempo</TableHead>
                    <TableHead>Erros</TableHead>
                    <TableHead>Avisos</TableHead>
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
                      <TableCell className="text-sm font-mono max-w-[200px] truncate">{log.expression}</TableCell>
                      <TableCell className="text-sm">{log.executionTimeMs.toFixed(2)}ms</TableCell>
                      <TableCell className="text-sm text-destructive">{log.errors.join(', ') || '—'}</TableCell>
                      <TableCell className="text-sm text-amber-600">{log.warnings.join(', ') || '—'}</TableCell>
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
