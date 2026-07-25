import type { CustomEntityRecord, FieldDefinition, CustomLayoutRecord, CustomDataRecord, EntitySummary, FieldType, LayoutComponent } from '../types';
import { EntityEngine } from '../entities';
import { FieldEngine } from '../fields';
import { LayoutEngine } from '../layouts';
import { Renderer } from '../renderer';
import { FormValidator, FormEngine } from '../forms';
import { BuilderRegistry } from '../registry';

export const BuilderEntityService = {
  async create(companyId: string, name: string, slug: string, description?: string, icon?: string, color?: string): Promise<CustomEntityRecord> {
    const entity = await EntityEngine.create({
      id: `entity-${Date.now()}`,
      companyId,
      name,
      slug,
      description: description ?? null,
      icon: icon ?? null,
      color: color ?? '#3b82f6',
      active: true,
    });
    return entity;
  },

  async list(companyId: string): Promise<CustomEntityRecord[]> {
    return EntityEngine.findByCompany(companyId);
  },

  async getById(id: string): Promise<CustomEntityRecord | null> {
    return EntityEngine.findById(id);
  },

  async update(id: string, data: Partial<CustomEntityRecord>): Promise<CustomEntityRecord | null> {
    return EntityEngine.update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return EntityEngine.delete(id);
  },

  async getSummaries(companyId: string): Promise<EntitySummary[]> {
    const entities = await EntityEngine.findByCompany(companyId);
    const fieldCounts: Record<string, number> = {};
    const recordCounts: Record<string, number> = {};
    for (const e of entities) {
      fieldCounts[e.id] = await FieldEngine.countByEntity(e.id);
      recordCounts[e.id] = 0;
    }
    return EntityEngine.getSummary(companyId, fieldCounts, recordCounts);
  },
};

export const BuilderFieldService = {
  async create(data: {
    entityId: string; name: string; label: string; type: FieldType;
    required?: boolean; defaultValue?: string; options?: { value: string; label: string }[];
    placeholder?: string; helpText?: string; order?: number;
  }): Promise<FieldDefinition> {
    return FieldEngine.create({
      entityId: data.entityId,
      name: data.name,
      label: data.label,
      type: data.type,
      required: data.required,
      defaultValue: data.defaultValue,
      options: data.options ?? null,
      placeholder: data.placeholder ?? null,
      helpText: data.helpText ?? null,
      order: data.order,
    });
  },

  async listByEntity(entityId: string): Promise<FieldDefinition[]> {
    return FieldEngine.findByEntity(entityId);
  },

  async getById(id: string): Promise<FieldDefinition | null> {
    return FieldEngine.findById(id);
  },

  async update(id: string, data: Partial<FieldDefinition>): Promise<FieldDefinition | null> {
    return FieldEngine.update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return FieldEngine.delete(id);
  },
};

export const BuilderLayoutService = {
  async create(entityId: string, name: string, layout: LayoutComponent[]): Promise<CustomLayoutRecord> {
    return LayoutEngine.create({ entityId, name, layout });
  },

  async listByEntity(entityId: string): Promise<CustomLayoutRecord[]> {
    return LayoutEngine.findByEntity(entityId);
  },

  async getById(id: string): Promise<CustomLayoutRecord | null> {
    return LayoutEngine.findById(id);
  },

  async update(id: string, data: Partial<CustomLayoutRecord>): Promise<CustomLayoutRecord | null> {
    return LayoutEngine.update(id, data);
  },

  async delete(id: string): Promise<boolean> {
    return LayoutEngine.delete(id);
  },

  async activate(id: string): Promise<CustomLayoutRecord | null> {
    return LayoutEngine.activate(id);
  },
};

export const BuilderRendererService = {
  renderDefault(entity: CustomEntityRecord, fields: FieldDefinition[], mode: 'create' | 'edit' | 'view' = 'create') {
    return Renderer.renderDefault(entity, fields, mode);
  },

  renderWithLayout(entity: CustomEntityRecord, fields: FieldDefinition[], layout: CustomLayoutRecord, data: Record<string, unknown>, mode: 'create' | 'edit' | 'view' = 'create') {
    const context = Renderer.buildContext(entity, fields, data, mode);
    return Renderer.renderLayout(layout, fields, data, context.errors, mode);
  },

  validate(fields: FieldDefinition[], data: Record<string, unknown>): Record<string, string> {
    return FormValidator.validateForm(fields, data);
  },

  prepareData(fields: FieldDefinition[], formData: Record<string, unknown>): Record<string, unknown> {
    return Renderer.prepareData(fields, formData);
  },

  buildDefaultValues(fields: FieldDefinition[]): Record<string, unknown> {
    return FormEngine.buildDefaultValues(fields);
  },
};
