import type {
  DashboardMetrics,
  ChartDataPoint,
} from '../types';

const currentMonth = new Date().getMonth();
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function revenueByMonth(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = (currentMonth - i + 12) % 12;
    data.push({
      label: monthNames[m],
      value: Math.round(80000 + Math.random() * 120000),
      secondary: Math.round(50000 + Math.random() * 80000),
    });
  }
  return data;
}

function quotationsByMonth(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = (currentMonth - i + 12) % 12;
    data.push({
      label: monthNames[m],
      value: Math.round(10 + Math.random() * 20),
      secondary: Math.round(5 + Math.random() * 10),
    });
  }
  return data;
}

function productionByDepartment(): ChartDataPoint[] {
  return [
    { label: 'Marcenaria', value: 12 },
    { label: 'Serralheria', value: 8 },
    { label: 'Pintura', value: 6 },
    { label: 'Montagem', value: 10 },
    { label: 'Acabamento', value: 4 },
  ];
}

function commercialFunnel(): ChartDataPoint[] {
  return [
    { label: 'Leads', value: 120 },
    { label: 'Qualificados', value: 78 },
    { label: 'Orçamentos', value: 45 },
    { label: 'Negociação', value: 28 },
    { label: 'Fechados', value: 18 },
  ];
}

function financialFlow(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const m = (currentMonth - i + 12) % 12;
    data.push({
      label: monthNames[m],
      value: Math.round(70000 + Math.random() * 130000),
      secondary: Math.round(40000 + Math.random() * 100000),
    });
  }
  return data;
}

function projectsByStatus(): ChartDataPoint[] {
  return [
    { label: 'Planejamento', value: 5, color: '#93c5fd' },
    { label: 'Em Produção', value: 8, color: '#fbbf24' },
    { label: 'Em Instalação', value: 4, color: '#a78bfa' },
    { label: 'Finalizados', value: 12, color: '#34d399' },
    { label: 'Atrasados', value: 3, color: '#f87171' },
  ];
}

export class DashboardRepository {
  async getMetrics(): Promise<DashboardMetrics> {
    return {
      commercial: {
        leadsMonth: 42,
        leadsMonthDelta: 12,
        conversionRate: 38.5,
        conversionRateDelta: 3.2,
        scheduledVisits: 15,
        scheduledVisitsDelta: -2,
        quotationsEmitted: 28,
        quotationsEmittedDelta: 5,
        quotationsApproved: 18,
        quotationsApprovedDelta: 3,
        averageTicket: 8500,
        averageTicketDelta: 450,
      },
      production: {
        activeProjects: 15,
        activeProjectsDelta: 2,
        delayedOrders: 3,
        delayedOrdersDelta: -1,
        averageProductionDays: 12.5,
        averageProductionDaysDelta: -0.5,
        pendingInstallations: 6,
        pendingInstallationsDelta: 1,
      },
      financial: {
        monthlyRevenue: 187450.00,
        monthlyRevenueDelta: 15230.00,
        monthlyExpenses: 123800.00,
        monthlyExpensesDelta: 4200.00,
        cashFlow: 63650.00,
        cashFlowDelta: 11030.00,
        profit: 63650.00,
        profitDelta: 11030.00,
        accountsReceivable: 95000.00,
        accountsReceivableDelta: 5000.00,
        accountsPayable: 42000.00,
        accountsPayableDelta: -3000.00,
      },
      operation: {
        activeProjects: 15,
        openWorkOrders: 23,
        todayProductions: 7,
        todayInstallations: 2,
      },
    };
  }

  async getRevenueByMonth(): Promise<ChartDataPoint[]> {
    return revenueByMonth();
  }

  async getQuotationsByMonth(): Promise<ChartDataPoint[]> {
    return quotationsByMonth();
  }

  async getProductionByDepartment(): Promise<ChartDataPoint[]> {
    return productionByDepartment();
  }

  async getCommercialFunnel(): Promise<ChartDataPoint[]> {
    return commercialFunnel();
  }

  async getFinancialFlow(): Promise<ChartDataPoint[]> {
    return financialFlow();
  }

  async getProjectsByStatus(): Promise<ChartDataPoint[]> {
    return projectsByStatus();
  }
}

export const dashboardRepository = new DashboardRepository();
