import { z } from 'zod/v4';

const dateField = z.instanceof(Date).or(z.string().pipe(z.coerce.date()));

export const dashboardPreferenceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  layout: z.string().optional().default('default'),
  favoriteCards: z.array(z.string()).default([]),
  favoriteCharts: z.array(z.string()).default([]),
  defaultPeriod: z.enum(['today', 'week', 'month', 'quarter', 'year', 'custom']).default('month'),
  defaultCompanyId: z.string().optional().default(''),
  defaultDepartment: z.string().optional().default(''),
  defaultResponsible: z.string().optional().default(''),
  createdAt: dateField,
  updatedAt: dateField,
});
export type DashboardPreferenceSchemaType = z.infer<typeof dashboardPreferenceSchema>;

export const dashboardWidgetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum([
    'stat', 'metric', 'progress',
    'line_chart', 'bar_chart', 'area_chart',
    'pie_chart', 'funnel_chart',
    'table',
  ]),
  module: z.enum(['commercial', 'production', 'financial', 'operation', 'general']),
  position: z.number().default(0),
  width: z.enum(['full', 'half', 'third', 'two_thirds']).default('half'),
  height: z.enum(['short', 'medium', 'tall']).default('medium'),
  active: z.boolean().default(true),
});
export type DashboardWidgetSchemaType = z.infer<typeof dashboardWidgetSchema>;

export const globalFilterSchema = z.object({
  companyId: z.string().optional().default(''),
  period: z.enum(['today', 'week', 'month', 'quarter', 'year', 'custom']).default('month'),
  startDate: dateField.optional(),
  endDate: dateField.optional(),
  department: z.string().optional().default(''),
  responsible: z.string().optional().default(''),
});
export type GlobalFilterSchemaType = z.infer<typeof globalFilterSchema>;
