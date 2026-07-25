import type { CustomEntityRecord, FieldDefinition, CustomLayoutRecord, CustomDataRecord, FieldType, FieldOption, ValidationConfig, LayoutComponent } from '@/core/builder';

interface EntityRow {
  id: string; companyId: string; name: string; slug: string;
  description: string | null; icon: string | null; color: string;
  active: boolean; createdAt: Date; updatedAt: Date;
}

interface FieldRow {
  id: string; entityId: string; name: string; label: string; type: string;
  required: boolean; defaultValue: string | null;
  options: string | null; placeholder: string | null; helpText: string | null;
  order: number; active: boolean;
  validations: string | null;
  relationEntityId: string | null; relationField: string | null;
  createdAt: Date; updatedAt: Date;
}

interface LayoutRow {
  id: string; entityId: string; name: string;
  layout: string; version: number; active: boolean;
  createdAt: Date; updatedAt: Date;
}

interface RecordRow {
  id: string; entityId: string; data: string;
  createdBy: string | null; createdAt: Date; updatedAt: Date;
}

const entities: EntityRow[] = [
  { id: 'entity-1', companyId: 'company-1', name: 'Visitas Técnicas', slug: 'visitas-tecnicas', description: 'Registro de visitas técnicas realizadas', icon: 'MapPin', color: '#10b981', active: true, createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01') },
  { id: 'entity-2', companyId: 'company-1', name: 'Orçamentos Rápidos', slug: 'orcamentos-rapidos', description: 'Orçamentos simplificados para clientes', icon: 'DollarSign', color: '#f59e0b', active: true, createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05') },
  { id: 'entity-3', companyId: 'company-1', name: 'Checklist Instalação', slug: 'checklist-instalacao', description: 'Checklist pós-instalação', icon: 'CheckSquare', color: '#3b82f6', active: true, createdAt: new Date('2026-07-10'), updatedAt: new Date('2026-07-10') },
];

const fields: FieldRow[] = [
  { id: 'fld-1', entityId: 'entity-1', name: 'cliente', label: 'Cliente', type: 'text', required: true, defaultValue: null, options: null, placeholder: 'Nome do cliente', helpText: null, order: 0, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-2', entityId: 'entity-1', name: 'data_visita', label: 'Data da Visita', type: 'date', required: true, defaultValue: null, options: null, placeholder: null, helpText: null, order: 1, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-3', entityId: 'entity-1', name: 'tipo', label: 'Tipo de Visita', type: 'select', required: true, defaultValue: null, options: JSON.stringify([{ value: 'comercial', label: 'Comercial' }, { value: 'tecnica', label: 'Técnica' }, { value: 'pos-venda', label: 'Pós-venda' }]), placeholder: null, helpText: null, order: 2, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-4', entityId: 'entity-1', name: 'observacoes', label: 'Observações', type: 'textarea', required: false, defaultValue: null, options: null, placeholder: 'Observações da visita', helpText: null, order: 3, active: true, validations: '[]', relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-5', entityId: 'entity-1', name: 'fotos', label: 'Fotos', type: 'image', required: false, defaultValue: null, options: null, placeholder: null, helpText: 'Anexar fotos da visita', order: 4, active: true, validations: '[]', relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-6', entityId: 'entity-2', name: 'cliente', label: 'Cliente', type: 'text', required: true, defaultValue: null, options: null, placeholder: 'Nome do cliente', helpText: null, order: 0, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-7', entityId: 'entity-2', name: 'telefone', label: 'Telefone', type: 'phone', required: true, defaultValue: null, options: null, placeholder: '(11) 99999-8888', helpText: null, order: 1, active: true, validations: JSON.stringify([{ rule: 'required' }, { rule: 'phone' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-8', entityId: 'entity-2', name: 'email', label: 'Email', type: 'email', required: false, defaultValue: null, options: null, placeholder: 'cliente@email.com', helpText: null, order: 2, active: true, validations: JSON.stringify([{ rule: 'email' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-9', entityId: 'entity-2', name: 'valor', label: 'Valor', type: 'currency', required: true, defaultValue: null, options: null, placeholder: '0,00', helpText: null, order: 3, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-10', entityId: 'entity-2', name: 'descricao', label: 'Descrição', type: 'textarea', required: false, defaultValue: null, options: null, placeholder: 'Descrição do orçamento', helpText: null, order: 4, active: true, validations: '[]', relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-11', entityId: 'entity-3', name: 'data_instalacao', label: 'Data da Instalação', type: 'date', required: true, defaultValue: null, options: null, placeholder: null, helpText: null, order: 0, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-12', entityId: 'entity-3', name: 'cliente', label: 'Cliente', type: 'text', required: true, defaultValue: null, options: null, placeholder: null, helpText: null, order: 1, active: true, validations: JSON.stringify([{ rule: 'required' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-13', entityId: 'entity-3', name: 'items_conferidos', label: 'Itens Conferidos', type: 'checkbox', required: false, defaultValue: 'false', options: null, placeholder: null, helpText: null, order: 2, active: true, validations: '[]', relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-14', entityId: 'entity-3', name: 'cliente_satisfeito', label: 'Cliente Satisfeito', type: 'switch', required: false, defaultValue: 'false', options: null, placeholder: null, helpText: null, order: 3, active: true, validations: '[]', relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-15', entityId: 'entity-3', name: 'observacoes', label: 'Observações', type: 'textarea', required: false, defaultValue: null, options: null, placeholder: null, helpText: 'Observações finais da instalação', order: 4, active: true, validations: '[]', relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
  { id: 'fld-16', entityId: 'entity-3', name: 'cpf_cliente', label: 'CPF do Cliente', type: 'document', required: false, defaultValue: null, options: null, placeholder: '000.000.000-00', helpText: null, order: 5, active: true, validations: JSON.stringify([{ rule: 'cpf' }]), relationEntityId: null, relationField: null, createdAt: new Date(), updatedAt: new Date() },
];

const layouts: LayoutRow[] = [
  { id: 'lay-1', entityId: 'entity-1', name: 'Layout Padrão', layout: JSON.stringify([{ id: 'comp-1', type: 'section', title: 'Dados da Visita', children: [], fieldIds: ['fld-1', 'fld-2', 'fld-3'], columns: undefined, config: {} }, { id: 'comp-2', type: 'section', title: 'Informações Adicionais', children: [], fieldIds: ['fld-4', 'fld-5'], columns: undefined, config: {} }]), version: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lay-2', entityId: 'entity-2', name: 'Layout Padrão', layout: JSON.stringify([{ id: 'comp-3', type: 'grid', title: 'Dados do Cliente', columns: 2, children: [
    { id: 'comp-4', type: 'section', title: 'Identificação', children: [], fieldIds: ['fld-6', 'fld-7', 'fld-8'], config: {} },
    { id: 'comp-5', type: 'section', title: 'Orçamento', children: [], fieldIds: ['fld-9', 'fld-10'], config: {} },
  ], fieldIds: [], config: {} }]), version: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 'lay-3', entityId: 'entity-3', name: 'Layout Padrão', layout: JSON.stringify([{ id: 'comp-6', type: 'tabs', title: 'Checklist', children: [
    { id: 'comp-7', type: 'section', title: 'Identificação', children: [], fieldIds: ['fld-11', 'fld-12', 'fld-16'], config: {} },
    { id: 'comp-8', type: 'section', title: 'Conferência', children: [], fieldIds: ['fld-13', 'fld-14', 'fld-15'], config: {} },
  ], fieldIds: [], config: {} }]), version: 1, active: true, createdAt: new Date(), updatedAt: new Date() },
];

const records: RecordRow[] = [
  { id: 'rec-1', entityId: 'entity-1', data: JSON.stringify({ cliente: 'João Silva', data_visita: '2026-07-20', tipo: 'tecnica', observacoes: 'Visita para medição do banner.', fotos: '' }), createdBy: 'user-1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'rec-2', entityId: 'entity-2', data: JSON.stringify({ cliente: 'Maria Oliveira', telefone: '(11) 98888-7777', email: 'maria@email.com', valor: '2500', descricao: 'Banner 3x2m em lona.' }), createdBy: 'user-1', createdAt: new Date(), updatedAt: new Date() },
  { id: 'rec-3', entityId: 'entity-3', data: JSON.stringify({ data_instalacao: '2026-07-22', cliente: 'Carlos Santos', items_conferidos: 'true', cliente_satisfeito: 'true', observacoes: 'Instalação concluída com sucesso.', cpf_cliente: '529.982.247-25' }), createdBy: 'user-2', createdAt: new Date(), updatedAt: new Date() },
];

function toEntityRecord(row: EntityRow): CustomEntityRecord {
  return { ...row };
}

function parseFieldOptions(options: string | null): FieldOption[] | null {
  if (!options) return null;
  try { return JSON.parse(options); } catch { return null; }
}

function parseValidations(validations: string | null): ValidationConfig[] {
  if (!validations) return [];
  try { return JSON.parse(validations); } catch { return []; }
}

function toFieldRecord(row: FieldRow): FieldDefinition {
  return {
    id: row.id, entityId: row.entityId, name: row.name, label: row.label,
    type: row.type as FieldType, required: row.required,
    defaultValue: row.defaultValue, options: parseFieldOptions(row.options),
    placeholder: row.placeholder, helpText: row.helpText, order: row.order,
    active: row.active, validations: parseValidations(row.validations),
    relationEntityId: row.relationEntityId ?? undefined, relationField: row.relationField ?? undefined,
    createdAt: row.createdAt, updatedAt: row.updatedAt,
  };
}

function toLayoutRecord(row: LayoutRow): CustomLayoutRecord {
  let layout: LayoutComponent[];
  try { layout = JSON.parse(row.layout); } catch { layout = []; }
  return { id: row.id, entityId: row.entityId, name: row.name, layout, version: row.version, active: row.active, createdAt: row.createdAt, updatedAt: row.updatedAt };
}

function toDataRecord(row: RecordRow): CustomDataRecord {
  let data: Record<string, unknown>;
  try { data = JSON.parse(row.data); } catch { data = {}; }
  return { id: row.id, entityId: row.entityId, data, createdBy: row.createdBy, createdAt: row.createdAt, updatedAt: row.updatedAt };
}

export const EntityRepository = {
  async findAll(companyId: string): Promise<CustomEntityRecord[]> {
    return entities.filter((e) => e.companyId === companyId).map(toEntityRecord);
  },
  async findById(id: string): Promise<CustomEntityRecord | null> {
    const row = entities.find((e) => e.id === id);
    return row ? toEntityRecord(row) : null;
  },
  async create(data: Omit<CustomEntityRecord, 'createdAt' | 'updatedAt'>): Promise<CustomEntityRecord> {
    const row: EntityRow = { ...data, createdAt: new Date(), updatedAt: new Date() };
    entities.push(row);
    return toEntityRecord(row);
  },
  async update(id: string, data: Partial<CustomEntityRecord>): Promise<CustomEntityRecord | null> {
    const index = entities.findIndex((e) => e.id === id);
    if (index === -1) return null;
    entities[index] = { ...entities[index], ...data, updatedAt: new Date() };
    return toEntityRecord(entities[index]);
  },
  async delete(id: string): Promise<boolean> {
    const index = entities.findIndex((e) => e.id === id);
    if (index === -1) return false;
    entities.splice(index, 1); return true;
  },
};

export const FieldRepository = {
  async findByEntity(entityId: string): Promise<FieldDefinition[]> {
    return fields.filter((f) => f.entityId === entityId).map(toFieldRecord).sort((a, b) => a.order - b.order);
  },
  async findById(id: string): Promise<FieldDefinition | null> {
    const row = fields.find((f) => f.id === id);
    return row ? toFieldRecord(row) : null;
  },
  async create(data: Omit<FieldDefinition, 'createdAt' | 'updatedAt'>): Promise<FieldDefinition> {
    const row: FieldRow = {
      id: data.id, entityId: data.entityId, name: data.name, label: data.label,
      type: data.type, required: data.required, defaultValue: data.defaultValue,
      options: data.options ? JSON.stringify(data.options) : null,
      placeholder: data.placeholder, helpText: data.helpText, order: data.order,
      active: data.active, validations: JSON.stringify(data.validations),
      relationEntityId: data.relationEntityId ?? null, relationField: data.relationField ?? null,
      createdAt: new Date(), updatedAt: new Date(),
    };
    fields.push(row);
    return toFieldRecord(row);
  },
  async update(id: string, data: Partial<FieldDefinition>): Promise<FieldDefinition | null> {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return null;
    if (data.options !== undefined) fields[index].options = JSON.stringify(data.options);
    if (data.validations !== undefined) fields[index].validations = JSON.stringify(data.validations);
    const updated = { ...fields[index], ...data, options: fields[index].options, validations: fields[index].validations, updatedAt: new Date() };
    fields[index] = updated;
    return toFieldRecord(updated);
  },
  async delete(id: string): Promise<boolean> {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return false;
    fields.splice(index, 1); return true;
  },
};

export const LayoutRepository = {
  async findByEntity(entityId: string): Promise<CustomLayoutRecord[]> {
    return layouts.filter((l) => l.entityId === entityId).map(toLayoutRecord).sort((a, b) => b.version - a.version);
  },
  async findById(id: string): Promise<CustomLayoutRecord | null> {
    const row = layouts.find((l) => l.id === id);
    return row ? toLayoutRecord(row) : null;
  },
  async create(data: Omit<CustomLayoutRecord, 'createdAt' | 'updatedAt'>): Promise<CustomLayoutRecord> {
    const row: LayoutRow = {
      id: data.id, entityId: data.entityId, name: data.name,
      layout: JSON.stringify(data.layout), version: data.version, active: data.active,
      createdAt: new Date(), updatedAt: new Date(),
    };
    layouts.push(row);
    return toLayoutRecord(row);
  },
  async update(id: string, data: Partial<CustomLayoutRecord>): Promise<CustomLayoutRecord | null> {
    const index = layouts.findIndex((l) => l.id === id);
    if (index === -1) return null;
    if (data.layout !== undefined) layouts[index].layout = JSON.stringify(data.layout);
    const updated = { ...layouts[index], ...data, layout: layouts[index].layout, updatedAt: new Date() };
    layouts[index] = updated;
    return toLayoutRecord(updated);
  },
  async delete(id: string): Promise<boolean> {
    const index = layouts.findIndex((l) => l.id === id);
    if (index === -1) return false;
    layouts.splice(index, 1); return true;
  },
};

export const RecordRepository = {
  async findByEntity(entityId: string): Promise<CustomDataRecord[]> {
    return records.filter((r) => r.entityId === entityId).map(toDataRecord).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  async findById(id: string): Promise<CustomDataRecord | null> {
    const row = records.find((r) => r.id === id);
    return row ? toDataRecord(row) : null;
  },
  async create(data: Omit<CustomDataRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomDataRecord> {
    const row: RecordRow = {
      id: `rec-${Date.now()}`, entityId: data.entityId,
      data: JSON.stringify(data.data), createdBy: data.createdBy,
      createdAt: new Date(), updatedAt: new Date(),
    };
    records.push(row);
    return toDataRecord(row);
  },
  async update(id: string, data: Partial<CustomDataRecord>): Promise<CustomDataRecord | null> {
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;
    if (data.data !== undefined) records[index].data = JSON.stringify(data.data);
    records[index].updatedAt = new Date();
    return toDataRecord(records[index]);
  },
  async delete(id: string): Promise<boolean> {
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return false;
    records.splice(index, 1); return true;
  },
};
