import type { ChartType, WidgetType, MetricCategory } from '@/core/analytics';

export interface DashboardFormData {
  name: string;
  description: string;
  active: boolean;
}

export interface WidgetFormData {
  type: WidgetType;
  title: string;
  width: number;
  height: number;
}

export interface ReportFormData {
  name: string;
  description: string;
  module: string;
  chartType: ChartType | '';
  shared: boolean;
}

export interface ExportFormData {
  format: 'pdf' | 'xlsx' | 'csv';
  title: string;
}

export interface KpiFilterData {
  category: MetricCategory | '';
}

export interface MetricHistoryData {
  metricId: string;
  granularity: 'day' | 'week' | 'month' | 'year';
  dateStart: string;
  dateEnd: string;
}
