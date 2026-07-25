'use client';

import type { CustomEntityRecord, FieldDefinition, CustomLayoutRecord, CustomDataRecord, FieldType } from '@/core/builder';
import { EntityModuleService, FieldModuleService, LayoutModuleService, RecordModuleService } from '../services';

export async function createEntity(companyId: string, name: string, slug: string, description?: string): Promise<CustomEntityRecord> {
  return EntityModuleService.create(companyId, { name, slug, description, color: '#3b82f6', active: true });
}

export async function updateEntity(id: string, data: { name?: string; description?: string; active?: boolean }): Promise<CustomEntityRecord | null> {
  return EntityModuleService.update(id, data);
}

export async function deleteEntity(id: string): Promise<boolean> {
  return EntityModuleService.delete(id);
}

export async function createField(entityId: string, name: string, label: string, type: FieldType, required = false): Promise<FieldDefinition> {
  return FieldModuleService.create({ entityId, name, label, type, required, order: 0, validations: required ? [{ rule: 'required', message: `${label} é obrigatório` }] : [] });
}

export async function updateField(id: string, data: { label?: string; required?: boolean }): Promise<FieldDefinition | null> {
  return FieldModuleService.update(id, data);
}

export async function deleteField(id: string): Promise<boolean> {
  return FieldModuleService.delete(id);
}

export async function createLayout(entityId: string, name: string, layout: import('@/core/builder').LayoutComponent[]): Promise<CustomLayoutRecord> {
  return LayoutModuleService.create({ entityId, name, layout, active: true });
}

export async function deleteLayout(id: string): Promise<boolean> {
  return LayoutModuleService.delete(id);
}

export async function createRecord(entityId: string, data: Record<string, unknown>, createdBy?: string): Promise<CustomDataRecord> {
  return RecordModuleService.create(entityId, data, createdBy);
}

export async function updateRecord(id: string, data: Record<string, unknown>): Promise<CustomDataRecord | null> {
  return RecordModuleService.update(id, data);
}

export async function deleteRecord(id: string): Promise<boolean> {
  return RecordModuleService.delete(id);
}
