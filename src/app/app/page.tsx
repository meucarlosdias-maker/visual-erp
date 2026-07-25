'use client';
import { useState } from 'react';
import { useDashboardMetrics, useAllCharts } from '@/modules/dashboard/hooks/use-dashboard';
import { GlobalFilters } from '@/modules/dashboard/components/GlobalFilters';
import { CommercialSection } from '@/modules/dashboard/components/CommercialSection';
import { ProductionSection } from '@/modules/dashboard/components/ProductionSection';
import { FinancialSection } from '@/modules/dashboard/components/FinancialSection';
import { OperationSection } from '@/modules/dashboard/components/OperationSection';
import { LayoutDashboard } from '@/constants/icons';
import type { GlobalFilter } from '@/modules/dashboard/types';

export default function DashboardPage() {
  const { metrics, loading } = useDashboardMetrics();
  const {
    revenueData, quotationsData, productionDeptData,
    funnelData, financialFlowData, projectsStatusData,
    loading: chartsLoading,
  } = useAllCharts();
  const [filters, setFilters] = useState<GlobalFilter>({
    companyId: '', period: 'month', startDate: undefined, endDate: undefined,
    department: '', responsible: '',
  });

  const isLoading = loading || chartsLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Dashboard Executivo</h1>
            <p className="text-sm text-muted-foreground">Indicadores estratégicos do Visual ERP</p>
          </div>
        </div>
      </div>

      <GlobalFilters filters={filters} onChange={setFilters} />

      <div className="space-y-8">
        {metrics && (
          <>
            <CommercialSection
              metrics={metrics.commercial}
              quotationsData={quotationsData}
              funnelData={funnelData}
              loading={isLoading}
            />
            <ProductionSection
              metrics={metrics.production}
              productionDeptData={productionDeptData}
              projectsStatusData={projectsStatusData}
              loading={isLoading}
            />
            <FinancialSection
              metrics={metrics.financial}
              revenueData={revenueData}
              financialFlowData={financialFlowData}
              loading={isLoading}
            />
            <OperationSection
              metrics={metrics.operation}
              loading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
