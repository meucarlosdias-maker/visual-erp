export type FieldType =
  | 'text' | 'number' | 'currency' | 'phone' | 'document' | 'email' | 'password'
  | 'textarea' | 'date' | 'time' | 'datetime' | 'select' | 'multiselect'
  | 'checkbox' | 'switch' | 'file' | 'image' | 'signature' | 'relation';

export type ValidationRule =
  | 'required' | 'min' | 'max' | 'regex' | 'email' | 'url'
  | 'cpf' | 'cnpj' | 'phone' | 'date' | 'file' | 'image';

export type LayoutComponentType = 'tabs' | 'section' | 'grid' | 'columns' | 'card' | 'accordion';

export interface FieldOption {
  value: string;
  label: string;
}

export interface ValidationConfig {
  rule: ValidationRule;
  value?: string | number;
  message?: string;
}

export interface FieldDefinition {
  id: string;
  entityId: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  defaultValue: string | null;
  options: FieldOption[] | null;
  placeholder: string | null;
  helpText: string | null;
  order: number;
  active: boolean;
  validations: ValidationConfig[];
  relationEntityId?: string;
  relationField?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomEntityRecord {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomLayoutRecord {
  id: string;
  entityId: string;
  name: string;
  layout: LayoutComponent[];
  version: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LayoutComponent {
  id: string;
  type: LayoutComponentType;
  title?: string;
  description?: string;
  columns?: number;
  children: LayoutComponent[];
  fieldIds?: string[];
  config?: Record<string, unknown>;
}

export interface CustomDataRecord {
  id: string;
  entityId: string;
  data: Record<string, unknown>;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntitySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  active: boolean;
  fieldCount: number;
  recordCount: number;
}

export interface FieldTypeInfo {
  type: FieldType;
  label: string;
  icon: string;
  hasOptions: boolean;
  hasRelation: boolean;
  hasValidation: boolean;
}

export const fieldTypeRegistry: FieldTypeInfo[] = [
  { type: 'text', label: 'Texto', icon: 'Type', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'number', label: 'Número', icon: 'Hash', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'currency', label: 'Moeda', icon: 'DollarSign', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'phone', label: 'Telefone', icon: 'Phone', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'document', label: 'CPF/CNPJ', icon: 'FileText', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'email', label: 'Email', icon: 'Mail', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'password', label: 'Senha', icon: 'Lock', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'textarea', label: 'Textarea', icon: 'AlignLeft', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'date', label: 'Data', icon: 'Calendar', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'time', label: 'Hora', icon: 'Clock', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'datetime', label: 'Data/Hora', icon: 'CalendarClock', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'select', label: 'Select', icon: 'ChevronDown', hasOptions: true, hasRelation: false, hasValidation: true },
  { type: 'multiselect', label: 'MultiSelect', icon: 'List', hasOptions: true, hasRelation: false, hasValidation: false },
  { type: 'checkbox', label: 'Checkbox', icon: 'CheckSquare', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'switch', label: 'Switch', icon: 'ToggleLeft', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'file', label: 'Arquivo', icon: 'File', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'image', label: 'Imagem', icon: 'Image', hasOptions: false, hasRelation: false, hasValidation: true },
  { type: 'signature', label: 'Assinatura', icon: 'PenTool', hasOptions: false, hasRelation: false, hasValidation: false },
  { type: 'relation', label: 'Relacionamento', icon: 'Link', hasOptions: false, hasRelation: true, hasValidation: false },
];

export const defaultValidations: { rule: ValidationRule; label: string }[] = [
  { rule: 'required', label: 'Obrigatório' },
  { rule: 'min', label: 'Valor mínimo' },
  { rule: 'max', label: 'Valor máximo' },
  { rule: 'regex', label: 'Regex' },
  { rule: 'email', label: 'Email' },
  { rule: 'url', label: 'URL' },
  { rule: 'cpf', label: 'CPF' },
  { rule: 'cnpj', label: 'CNPJ' },
  { rule: 'phone', label: 'Telefone' },
  { rule: 'date', label: 'Data' },
  { rule: 'file', label: 'Arquivo' },
  { rule: 'image', label: 'Imagem' },
];
