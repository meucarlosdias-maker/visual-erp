import { z } from 'zod';

export const ChartTypeEnum = z.enum(['line', 'bar', 'pie', 'area', 'radar', 'funnel', 'gauge', 'heatmap']);
export const WidgetTypeEnum = z.enum(['card', 'chart', 'table', 'kpi', 'ranking', 'funnel', 'goal', 'calendar']);
export const ExportFormatEnum = z.enum(['pdf', 'xlsx', 'csv']);
export const MetricCategoryEnum = z.enum(['commercial', 'crm', 'projects', 'production', 'financial', 'installation', 'team', 'clients', 'general']);

export const WidgetPositionSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  w: z.number().int().min(1).max(12),
  h: z.number().int().min(1).max(12),
});

export const DashboardLayoutSchema = z.object({
  columns: z.number().int().default(12),
  rowHeight: z.number().int().default(80),
  gap: z.number().int().default(16),
});

export const DashboardCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  layout: DashboardLayoutSchema.optional(),
  active: z.boolean().default(true),
});

export const DashboardUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  layout: DashboardLayoutSchema.optional(),
  active: z.boolean().optional(),
});

export const WidgetCreateSchema = z.object({
  type: WidgetTypeEnum,
  title: z.string().min(1),
  configuration: z.record(z.string(), z.unknown()).optional(),
  position: WidgetPositionSchema,
  width: z.number().int().default(4),
  height: z.number().int().default(3),
});

export const WidgetUpdateSchema = z.object({
  type: WidgetTypeEnum.optional(),
  title: z.string().optional(),
  configuration: z.record(z.string(), z.unknown()).optional(),
  position: WidgetPositionSchema.optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

export const ReportCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  module: z.string().optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
  columns: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  chartType: ChartTypeEnum.optional(),
  shared: z.boolean().default(false),
});

export const ReportUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  module: z.string().optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
  columns: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  chartType: ChartTypeEnum.optional(),
  shared: z.boolean().optional(),
});

export const MetricSnapshotCreateSchema = z.object({
  metric: z.string().min(1),
  value: z.number(),
  label: z.string().optional(),
  category: MetricCategoryEnum.optional(),
  unit: z.string().optional(),
  referenceDate: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const ExportRequestSchema = z.object({
  format: ExportFormatEnum,
  title: z.string().min(1),
  columns: z.array(z.object({ key: z.string(), label: z.string() })).min(1),
  filters: z.record(z.string(), z.unknown()).optional(),
});

export type DashboardCreateInput = z.infer<typeof DashboardCreateSchema>;
export type DashboardUpdateInput = z.infer<typeof DashboardUpdateSchema>;
export type WidgetCreateInput = z.infer<typeof WidgetCreateSchema>;
export type WidgetUpdateInput = z.infer<typeof WidgetUpdateSchema>;
export type ReportCreateInput = z.infer<typeof ReportCreateSchema>;
export type ReportUpdateInput = z.infer<typeof ReportUpdateSchema>;
export type MetricSnapshotCreateInput = z.infer<typeof MetricSnapshotCreateSchema>;
export type ExportRequestInput = z.infer<typeof ExportRequestSchema>;
