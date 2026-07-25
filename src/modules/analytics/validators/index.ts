import {
  DashboardCreateSchema,
  DashboardUpdateSchema,
  WidgetCreateSchema,
  ReportCreateSchema,
  ReportUpdateSchema,
  ExportRequestSchema,
} from '../schemas';
import type { DashboardCreateInput, DashboardUpdateInput, WidgetCreateInput, ReportCreateInput, ReportUpdateInput, ExportRequestInput } from '../schemas';

export function validateDashboardCreate(data: unknown): { success: true; data: DashboardCreateInput } | { success: false; error: string } {
  const result = DashboardCreateSchema.safeParse(data);
  if (!result.success) return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  return { success: true, data: result.data };
}

export function validateDashboardUpdate(data: unknown): { success: true; data: DashboardUpdateInput } | { success: false; error: string } {
  const result = DashboardUpdateSchema.safeParse(data);
  if (!result.success) return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  return { success: true, data: result.data };
}

export function validateWidgetCreate(data: unknown): { success: true; data: WidgetCreateInput } | { success: false; error: string } {
  const result = WidgetCreateSchema.safeParse(data);
  if (!result.success) return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  return { success: true, data: result.data };
}

export function validateReportCreate(data: unknown): { success: true; data: ReportCreateInput } | { success: false; error: string } {
  const result = ReportCreateSchema.safeParse(data);
  if (!result.success) return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  return { success: true, data: result.data };
}

export function validateReportUpdate(data: unknown): { success: true; data: ReportUpdateInput } | { success: false; error: string } {
  const result = ReportUpdateSchema.safeParse(data);
  if (!result.success) return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  return { success: true, data: result.data };
}

export function validateExportRequest(data: unknown): { success: true; data: ExportRequestInput } | { success: false; error: string } {
  const result = ExportRequestSchema.safeParse(data);
  if (!result.success) return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  return { success: true, data: result.data };
}
