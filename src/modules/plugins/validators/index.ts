import { PluginCreateSchema, PluginUpdateSchema, PluginSettingCreateSchema } from '../schemas';
import type { PluginCreateInput, PluginUpdateInput } from '../schemas';

export function validatePluginCreate(data: unknown): { success: true; data: PluginCreateInput } | { success: false; error: string } {
  const result = PluginCreateSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: issues };
  }
  return { success: true, data: result.data };
}

export function validatePluginUpdate(data: unknown): { success: true; data: PluginUpdateInput } | { success: false; error: string } {
  const result = PluginUpdateSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: issues };
  }
  return { success: true, data: result.data };
}

export function validatePluginSetting(data: unknown): { success: true; data: { key: string; value: string } } | { success: false; error: string } {
  const result = PluginSettingCreateSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((e) => e.message).join(', ');
    return { success: false, error: issues };
  }
  return { success: true, data: result.data };
}
