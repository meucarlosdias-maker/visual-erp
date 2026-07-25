import {
  EntityCreateSchema, EntityUpdateSchema,
  FieldCreateSchema, FieldUpdateSchema,
  LayoutCreateSchema, LayoutUpdateSchema,
  RecordCreateSchema,
} from '../schemas';
import type {
  EntityCreateInput, EntityUpdateInput,
  FieldCreateInput, FieldUpdateInput,
  LayoutCreateInput, LayoutUpdateInput,
  RecordCreateInput,
} from '../schemas';

function parseResult<T>(result: { success: boolean; data?: T; error?: unknown }): { success: true; data: T } | { success: false; error: string } {
  if (!result.success) {
    const issues = (result as { error: { issues: { message: string }[] } }).error.issues.map((e) => e.message).join(', ');
    return { success: false, error: issues };
  }
  return { success: true, data: result.data as T };
}

export function validateEntityCreate(data: unknown) {
  return parseResult<EntityCreateInput>(EntityCreateSchema.safeParse(data));
}

export function validateEntityUpdate(data: unknown) {
  return parseResult<EntityUpdateInput>(EntityUpdateSchema.safeParse(data));
}

export function validateFieldCreate(data: unknown) {
  return parseResult<FieldCreateInput>(FieldCreateSchema.safeParse(data));
}

export function validateFieldUpdate(data: unknown) {
  return parseResult<FieldUpdateInput>(FieldUpdateSchema.safeParse(data));
}

export function validateLayoutCreate(data: unknown) {
  return parseResult<LayoutCreateInput>(LayoutCreateSchema.safeParse(data));
}

export function validateLayoutUpdate(data: unknown) {
  return parseResult<LayoutUpdateInput>(LayoutUpdateSchema.safeParse(data));
}

export function validateRecordCreate(data: unknown) {
  return parseResult<RecordCreateInput>(RecordCreateSchema.safeParse(data));
}
