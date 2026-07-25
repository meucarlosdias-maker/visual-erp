import type { CustomEntityRecord, FieldDefinition, CustomLayoutRecord, CustomDataRecord, FieldType, LayoutComponent } from '@/core/builder';
import { EntityRepository, FieldRepository, LayoutRepository, RecordRepository } from '../repository';
import type { EntityCreateInput, EntityUpdateInput, FieldCreateInput, FieldUpdateInput, LayoutCreateInput, LayoutUpdateInput } from '../schemas';

export const EntityModuleService = {
  async list(companyId: string): Promise<CustomEntityRecord[]> {
    return EntityRepository.findAll(companyId);
  },
  async getById(id: string): Promise<CustomEntityRecord | null> {
    return EntityRepository.findById(id);
  },
  async create(companyId: string, input: EntityCreateInput): Promise<CustomEntityRecord> {
    return EntityRepository.create({
      id: `entity-${Date.now()}`,
      companyId,
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      icon: input.icon ?? null,
      color: input.color,
      active: input.active,
    });
  },
  async update(id: string, input: EntityUpdateInput): Promise<CustomEntityRecord | null> {
    return EntityRepository.update(id, input as Partial<CustomEntityRecord>);
  },
  async delete(id: string): Promise<boolean> {
    return EntityRepository.delete(id);
  },
};

export const FieldModuleService = {
  async listByEntity(entityId: string): Promise<FieldDefinition[]> {
    return FieldRepository.findByEntity(entityId);
  },
  async getById(id: string): Promise<FieldDefinition | null> {
    return FieldRepository.findById(id);
  },
  async create(input: FieldCreateInput): Promise<FieldDefinition> {
    return FieldRepository.create({
      id: `fld-${crypto.randomUUID().slice(0, 8)}`,
      entityId: input.entityId,
      name: input.name,
      label: input.label,
      type: input.type,
      required: input.required,
      defaultValue: input.defaultValue ?? null,
      options: input.options ?? null,
      placeholder: input.placeholder ?? null,
      helpText: input.helpText ?? null,
      order: input.order ?? 0,
      active: true,
      validations: input.validations ?? [],
      relationEntityId: undefined,
      relationField: undefined,
    });
  },
  async update(id: string, input: FieldUpdateInput): Promise<FieldDefinition | null> {
    return FieldRepository.update(id, input as Partial<FieldDefinition>);
  },
  async delete(id: string): Promise<boolean> {
    return FieldRepository.delete(id);
  },
};

export const LayoutModuleService = {
  async listByEntity(entityId: string): Promise<CustomLayoutRecord[]> {
    return LayoutRepository.findByEntity(entityId);
  },
  async getById(id: string): Promise<CustomLayoutRecord | null> {
    return LayoutRepository.findById(id);
  },
  async create(input: LayoutCreateInput): Promise<CustomLayoutRecord> {
    const existing = await LayoutRepository.findByEntity(input.entityId);
    return LayoutRepository.create({
      id: `lay-${crypto.randomUUID().slice(0, 8)}`,
      entityId: input.entityId,
      name: input.name,
      layout: input.layout,
      version: existing.length + 1,
      active: input.active,
    });
  },
  async update(id: string, input: LayoutUpdateInput): Promise<CustomLayoutRecord | null> {
    return LayoutRepository.update(id, input as Partial<CustomLayoutRecord>);
  },
  async delete(id: string): Promise<boolean> {
    return LayoutRepository.delete(id);
  },
};

export const RecordModuleService = {
  async listByEntity(entityId: string): Promise<CustomDataRecord[]> {
    return RecordRepository.findByEntity(entityId);
  },
  async getById(id: string): Promise<CustomDataRecord | null> {
    return RecordRepository.findById(id);
  },
  async create(entityId: string, data: Record<string, unknown>, createdBy?: string): Promise<CustomDataRecord> {
    return RecordRepository.create({ entityId, data, createdBy: createdBy ?? null });
  },
  async update(id: string, data: Record<string, unknown>): Promise<CustomDataRecord | null> {
    return RecordRepository.update(id, { data });
  },
  async delete(id: string): Promise<boolean> {
    return RecordRepository.delete(id);
  },
};
