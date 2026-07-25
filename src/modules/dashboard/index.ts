export { dashboardPreferenceSchema, dashboardWidgetSchema, globalFilterSchema } from './schemas';
export type { DashboardPreferenceSchemaType, DashboardWidgetSchemaType, GlobalFilterSchemaType } from './schemas';
export type {
  DashboardPreference, DashboardWidget, GlobalFilter,
  DashboardMetrics,
  CommercialMetrics, ProductionMetrics, FinancialMetrics, OperationMetrics,
  ChartDataPoint, ChartDataset,
  RevenueByMonth, QuotationsByMonth, ProductionByDepartment,
  CommercialFunnel, FinancialFlow, ProjectsByStatus,
} from './types';
export {
  PERIOD_LABELS, WIDGET_TYPE_LABELS, WIDGET_MODULE_LABELS,
  MODULE_ORDER, DEFAULT_WIDGETS,
} from './validators';
export * from './actions/dashboard-actions';
export { dashboardRepository } from './repository';
export { metricsService } from './services';
export {
  useDashboardMetrics, useChartData, useAllCharts,
} from './hooks/use-dashboard';
export {
  StatCard, MetricCard, ProgressCard,
  BarChartCard, LineChartCard, AreaChartCard,
  PieChartCard, FunnelChartCard,
  GlobalFilters,
  CommercialSection, ProductionSection, FinancialSection, OperationSection,
} from './components';
