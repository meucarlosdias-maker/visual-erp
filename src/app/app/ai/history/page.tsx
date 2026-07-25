'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { aiExecutionService } from '@/modules/ai/services/execution-service';
import type { AiExecution } from '@/modules/ai/types';
import { useState, useEffect } from 'react';

export default function AiHistoryPage() {
  const [data, setData] = useState<AiExecution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const list = await aiExecutionService.list();
      setData(list);
    } catch {
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <CrudPage
      title="Histórico de IA"
      description="Histórico de execuções da inteligência artificial"
    >
      {loading ? (
        <LoadingLocal message="Carregando histórico..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma execução registrada.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provedor</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Tokens In</TableHead>
              <TableHead>Tokens Out</TableHead>
              <TableHead>Custo</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((exec) => (
              <TableRow key={exec.id}>
                <TableCell className="font-mono text-xs">{exec.provider}</TableCell>
                <TableCell className="font-mono text-xs">{exec.model}</TableCell>
                <TableCell className="text-sm">{exec.tokensInput}</TableCell>
                <TableCell className="text-sm">{exec.tokensOutput}</TableCell>
                <TableCell className="text-sm">R$ {exec.cost.toFixed(6)}</TableCell>
                <TableCell className="text-sm">{(exec.duration / 1000).toFixed(2)}s</TableCell>
                <TableCell>
                  <Badge variant={exec.status === 'completed' ? 'default' : 'destructive'}>
                    {exec.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{new Date(exec.createdAt).toLocaleString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CrudPage>
  );
}
