'use client';
import { useAuditLogs } from '@/modules/system/hooks/use-audit';
import { AuditTimeline } from '@/modules/system/components/AuditTimeline';
import { History } from '@/constants/icons';

export default function AuditoriaPage() {
  const { logs, loading } = useAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Auditoria</h1>
          <p className="text-sm text-muted-foreground">Timeline de todas as ações realizadas no sistema</p>
        </div>
      </div>
      <AuditTimeline logs={logs} loading={loading} />
    </div>
  );
}
