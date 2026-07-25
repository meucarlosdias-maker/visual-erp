'use client';

import type { ExportFormat } from '@/core/analytics';
import { exportData, downloadFile } from '@/core/analytics';
import { DashboardService, ReportService, ExportService } from '../services';

export async function createDashboard(companyId: string, name: string, description?: string) {
  return DashboardService.create(companyId, { name, description, active: true });
}

export async function deleteDashboard(id: string) {
  return DashboardService.delete(id);
}

export async function exportReport(
  format: ExportFormat,
  title: string,
  columns: { key: string; label: string }[],
  data: Record<string, unknown>[],
) {
  const file = await ExportService.exportToFile(format, title, columns, data);
  downloadFile(file);
}
