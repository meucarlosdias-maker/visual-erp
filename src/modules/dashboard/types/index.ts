import type {
  DashboardPreferenceSchemaType,
  DashboardWidgetSchemaType,
  GlobalFilterSchemaType,
} from '../schemas';

export type DashboardPreference = DashboardPreferenceSchemaType;
export type DashboardWidget = DashboardWidgetSchemaType;
export type GlobalFilter = GlobalFilterSchemaType;

export interface DashboardMetrics {
  commercial: CommercialMetrics;
  production: ProductionMetrics;
  financial: FinancialMetrics;
  operation: OperationMetrics;
}

export interface CommercialMetrics {
  leadsMonth: number;
  leadsMonthDelta: number;
  conversionRate: number;
  conversionRateDelta: number;
  scheduledVisits: number;
  scheduledVisitsDelta: number;
  quotationsEmitted: number;
  quotationsEmittedDelta: number;
  quotationsApproved: number;
  quotationsApprovedDelta: number;
  averageTicket: number;
  averageTicketDelta: number;
}

export interface ProductionMetrics {
  activeProjects: number;
  activeProjectsDelta: number;
  delayedOrders: number;
  delayedOrdersDelta: number;
  averageProductionDays: number;
  averageProductionDaysDelta: number;
  pendingInstallations: number;
  pendingInstallationsDelta: number;
}

export interface FinancialMetrics {
  monthlyRevenue: number;
  monthlyRevenueDelta: number;
  monthlyExpenses: number;
  monthlyExpensesDelta: number;
  cashFlow: number;
  cashFlowDelta: number;
  profit: number;
  profitDelta: number;
  accountsReceivable: number;
  accountsReceivableDelta: number;
  accountsPayable: number;
  accountsPayableDelta: number;
}

export interface OperationMetrics {
  activeProjects: number;
  openWorkOrders: number;
  todayProductions: number;
  todayInstallations: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
  color?: string;
}

export interface ChartDataset {
  id: string;
  title: string;
  data: ChartDataPoint[];
}

export type RevenueByMonth = ChartDataset;
export type QuotationsByMonth = ChartDataset;
export type ProductionByDepartment = ChartDataset;
export type CommercialFunnel = ChartDataset;
export type FinancialFlow = ChartDataset;
export type ProjectsByStatus = ChartDataset;
