import type { CustomEntityRecord, FieldDefinition, CustomLayoutRecord } from '../types';

interface RegistryEntry {
  entity: CustomEntityRecord;
  fields: FieldDefinition[];
  layouts: CustomLayoutRecord[];
  activeLayout: CustomLayoutRecord | null;
}

const registry = new Map<string, RegistryEntry>();

export const BuilderRegistry = {
  register(entity: CustomEntityRecord, fields: FieldDefinition[], layouts: CustomLayoutRecord[]): void {
    const activeLayout = layouts.find((l) => l.active) ?? null;
    registry.set(entity.id, { entity, fields, layouts, activeLayout });
  },

  unregister(entityId: string): void {
    registry.delete(entityId);
  },

  get(entityId: string): RegistryEntry | undefined {
    return registry.get(entityId);
  },

  getEntity(entityId: string): CustomEntityRecord | undefined {
    return registry.get(entityId)?.entity;
  },

  getFields(entityId: string): FieldDefinition[] | undefined {
    return registry.get(entityId)?.fields;
  },

  getActiveLayout(entityId: string): CustomLayoutRecord | null | undefined {
    return registry.get(entityId)?.activeLayout;
  },

  list(): RegistryEntry[] {
    return Array.from(registry.values());
  },

  clear(): void {
    registry.clear();
  },
};
