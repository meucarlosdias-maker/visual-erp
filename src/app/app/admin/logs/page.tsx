'use client';
import { useSystemLogs } from '@/modules/system/hooks/use-system-logs';
import { LogViewer } from '@/modules/system/components/LogViewer';
import { AlertCircle } from '@/constants/icons';

export default function LogsPage() {
  const { logs, loading } = useSystemLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Logs do Sistema</h1>
          <p className="text-sm text-muted-foreground">Visualização de erros, avisos e informações técnicas</p>
        </div>
      </div>
      <LogViewer logs={logs} loading={loading} />
    </div>
  );
}
