'use client';
import { useSessions, useSessionActions } from '@/modules/system/hooks/use-sessions';
import { SessionsTable } from '@/modules/system/components/SessionsTable';
import { UserCheck } from '@/constants/icons';

export default function SessoesPage() {
  const { sessions, activeCount, loading, reload } = useSessions();
  const { revoke } = useSessionActions();

  const handleRevoke = async (id: string) => {
    await revoke(id);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserCheck className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Sessões</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} sessão(ões) ativa(s) de {sessions.length} total(is)
          </p>
        </div>
      </div>
      <SessionsTable
        sessions={sessions}
        loading={loading}
        onRevoke={handleRevoke}
        onReload={reload}
      />
    </div>
  );
}
