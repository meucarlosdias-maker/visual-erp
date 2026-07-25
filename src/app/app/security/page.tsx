'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { SecuritySummaryCards } from '@/modules/security/components';
import { useAuditEvents, useAccessLogs, usePolicies, useRetentionPolicies } from '@/modules/security/hooks';
import { LoadingLocal } from '@/components/feedback';

export default function SecurityDashboardPage() {
  const { data: audits, loading: loadingAudits } = useAuditEvents();
  const { data: logs, loading: loadingLogs } = useAccessLogs();
  const { data: policies, loading: loadingPolicies } = usePolicies();
  const { data: retentions, loading: loadingRetention } = useRetentionPolicies();

  if (loadingAudits || loadingLogs || loadingPolicies || loadingRetention) {
    return <LoadingLocal message="Carregando..." />;
  }

  return (
    <CrudPage title="Segurança" description="Dashboard de segurança, auditoria e conformidade">
      <SecuritySummaryCards
        auditCount={audits.length}
        logCount={logs.length}
        policyCount={policies.length}
        retentionCount={retentions.length}
      />
    </CrudPage>
  );
}
