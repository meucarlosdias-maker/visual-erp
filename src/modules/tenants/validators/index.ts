import {
  CompanyUpdateSchema,
  PlanCreateSchema,
  PlanUpdateSchema,
  SubscriptionCreateSchema,
  SubscriptionUpdateSchema,
  CompanySettingsUpdateSchema,
} from '../schemas';
import type { CompanyUpdateInput, PlanCreateInput, PlanUpdateInput, SubscriptionCreateInput, SubscriptionUpdateInput } from '../schemas';

export function validateCompanyUpdate(data: unknown): { success: true; data: CompanyUpdateInput } | { success: false; error: string } {
  const result = CompanyUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validatePlanCreate(data: unknown): { success: true; data: PlanCreateInput } | { success: false; error: string } {
  const result = PlanCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validatePlanUpdate(data: unknown): { success: true; data: PlanUpdateInput } | { success: false; error: string } {
  const result = PlanUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateSubscriptionCreate(data: unknown): { success: true; data: SubscriptionCreateInput } | { success: false; error: string } {
  const result = SubscriptionCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}

export function validateSubscriptionUpdate(data: unknown): { success: true; data: SubscriptionUpdateInput } | { success: false; error: string } {
  const result = SubscriptionUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.issues.map((e) => e.message).join(', ') };
  }
  return { success: true, data: result.data };
}
