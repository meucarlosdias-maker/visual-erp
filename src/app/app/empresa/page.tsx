'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { CompanyCard, UsageBar } from '@/modules/tenants/components';
import { useCompanyDashboard } from '@/modules/tenants/hooks';
import { Building2 } from '@/constants/icons';

export default function CompanyPage() {
  const { data, loading } = useCompanyDashboard();

  return (
    <CrudPage
      title="Dados da Empresa"
      description="Informações cadastrais e uso do sistema"
    >
      {loading ? (
        <LoadingLocal message="Carregando dados da empresa..." />
      ) : !data ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum dado encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyCard company={data.company} />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Uso do Plano</h3>
            </div>
            <UsageBar label="Usuários" used={data.usage.users} limit={data.plan?.usersLimit ?? 5} />
            <UsageBar label="Projetos Ativos" used={data.usage.activeProjects} limit={data.plan?.activeProjectsLimit ?? 10} />
            <UsageBar label="Clientes" used={data.usage.clients} limit={data.plan?.clientsLimit ?? 50} />
            <UsageBar label="Armazenamento" used={data.usage.storage} limit={data.plan?.storageLimit ?? 1024} unit="MB" />
          </div>
        </div>
      )}
    </CrudPage>
  );
}
