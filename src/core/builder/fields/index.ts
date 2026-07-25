import type { FieldDefinition, FieldType, FieldOption, ValidationConfig } from '../types';

const fields: FieldDefinition[] = [];

export const FieldEngine = {
  async create(data: {
    entityId: string; name: string; label: string; type: FieldType;
    required?: boolean; defaultValue?: string | null; options?: FieldOption[] | null;
    placeholder?: string | null; helpText?: string | null; order?: number;
    validations?: ValidationConfig[]; relationEntityId?: string; relationField?: string;
  }): Promise<FieldDefinition> {
    const record: FieldDefinition = {
      id: `fld-${crypto.randomUUID().slice(0, 8)}`,
      entityId: data.entityId,
      name: data.name,
      label: data.label,
      type: data.type,
      required: data.required ?? false,
      defaultValue: data.defaultValue ?? null,
      options: data.options ?? null,
      placeholder: data.placeholder ?? null,
      helpText: data.helpText ?? null,
      order: data.order ?? 0,
      active: true,
      validations: data.validations ?? [],
      relationEntityId: data.relationEntityId,
      relationField: data.relationField,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fields.push(record);
    return record;
  },

  async findByEntity(entityId: string): Promise<FieldDefinition[]> {
    return fields.filter((f) => f.entityId === entityId).sort((a, b) => a.order - b.order);
  },

  async findById(id: string): Promise<FieldDefinition | null> {
    return fields.find((f) => f.id === id) ?? null;
  },

  async update(id: string, data: Partial<FieldDefinition>): Promise<FieldDefinition | null> {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return null;
    fields[index] = { ...fields[index], ...data, updatedAt: new Date() };
    return fields[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return false;
    fields.splice(index, 1);
    return true;
  },

  async countByEntity(entityId: string): Promise<number> {
    return fields.filter((f) => f.entityId === entityId).length;
  },

  async getFieldMap(entityId: string): Promise<Map<string, FieldDefinition>> {
    const entityFields = await FieldEngine.findByEntity(entityId);
    const map = new Map<string, FieldDefinition>();
    for (const f of entityFields) {
      map.set(f.name, f);
      map.set(f.id, f);
    }
    return map;
  },
};
