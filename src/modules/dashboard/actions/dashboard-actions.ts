'use server';

import { metricsService } from '../services';

export async function getDashboardMetrics() {
  return metricsService.getAll();
}

export async function getRevenueByMonth() {
  return metricsService.getRevenueByMonth();
}

export async function getQuotationsByMonth() {
  return metricsService.getQuotationsByMonth();
}

export async function getProductionByDepartment() {
  return metricsService.getProductionByDepartment();
}

export async function getCommercialFunnel() {
  return metricsService.getCommercialFunnel();
}

export async function getFinancialFlow() {
  return metricsService.getFinancialFlow();
}

export async function getProjectsByStatus() {
  return metricsService.getProjectsByStatus();
}
