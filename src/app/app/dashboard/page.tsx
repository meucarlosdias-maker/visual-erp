'use client';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDashboardMetrics, useAllCharts } from '@/modules/dashboard/hooks/use-dashboard';
import { GlobalFilters } from '@/modules/dashboard/components/GlobalFilters';
import { OperationSection } from '@/modules/dashboard/components/OperationSection';
import { LayoutDashboard } from '@/constants/icons';
import type { GlobalFilter } from '@/modules/dashboard/types';

const CommercialSection = dynamic(() =>
  import('@/modules/dashboard/components/CommercialSection').then((mod) => ({ default: mod.CommercialSection }))
);
const ProductionSection = dynamic(() =>
  import('@/modules/dashboard/components/ProductionSection').then((mod) => ({ default: mod.ProductionSection }))
);
const FinancialSection = dynamic(() =>
  import('@/modules/dashboard/components/FinancialSection').then((mod) => ({ default: mod.FinancialSection }))
);

function SectionFallback() {
  return <div className="flex items-center justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
}

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
            <Suspense fallback={<SectionFallback />}>
              <CommercialSection
                metrics={metrics.commercial}
                quotationsData={quotationsData}
                funnelData={funnelData}
                loading={isLoading}
              />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <ProductionSection
                metrics={metrics.production}
                productionDeptData={productionDeptData}
                projectsStatusData={projectsStatusData}
                loading={isLoading}
              />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <FinancialSection
                metrics={metrics.financial}
                revenueData={revenueData}
                financialFlowData={financialFlowData}
                loading={isLoading}
              />
            </Suspense>
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
