import { dashboardRepository } from '../repository';
import type {
  DashboardMetrics,
  ChartDataPoint,
} from '../types';

export class MetricsService {
  async getAll(): Promise<DashboardMetrics> {
    return dashboardRepository.getMetrics();
  }

  async getRevenueByMonth(): Promise<ChartDataPoint[]> {
    return dashboardRepository.getRevenueByMonth();
  }

  async getQuotationsByMonth(): Promise<ChartDataPoint[]> {
    return dashboardRepository.getQuotationsByMonth();
  }

  async getProductionByDepartment(): Promise<ChartDataPoint[]> {
    return dashboardRepository.getProductionByDepartment();
  }

  async getCommercialFunnel(): Promise<ChartDataPoint[]> {
    return dashboardRepository.getCommercialFunnel();
  }

  async getFinancialFlow(): Promise<ChartDataPoint[]> {
    return dashboardRepository.getFinancialFlow();
  }

  async getProjectsByStatus(): Promise<ChartDataPoint[]> {
    return dashboardRepository.getProjectsByStatus();
  }
}

export const metricsService = new MetricsService();
