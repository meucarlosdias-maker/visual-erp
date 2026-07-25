import type { ConditionDefinition, ConditionConfig, ConditionOperator } from '../types';

const conditionDefinitions: Record<ConditionOperator, ConditionDefinition> = {
  equals: {
    operator: 'equals',
    label: 'Igual',
    description: 'Campo igual ao valor',
    valueType: 'string',
  },
  not_equals: {
    operator: 'not_equals',
    label: 'Diferente',
    description: 'Campo diferente do valor',
    valueType: 'string',
  },
  greater_than: {
    operator: 'greater_than',
    label: 'Maior que',
    description: 'Campo maior que o valor',
    valueType: 'number',
  },
  less_than: {
    operator: 'less_than',
    label: 'Menor que',
    description: 'Campo menor que o valor',
    valueType: 'number',
  },
  contains: {
    operator: 'contains',
    label: 'Contém',
    description: 'Campo contém o valor',
    valueType: 'string',
  },
  date_equals: {
    operator: 'date_equals',
    label: 'Data igual',
    description: 'Data igual ao valor',
    valueType: 'date',
  },
  date_before: {
    operator: 'date_before',
    label: 'Data anterior',
    description: 'Data anterior ao valor',
    valueType: 'date',
  },
  date_after: {
    operator: 'date_after',
    label: 'Data posterior',
    description: 'Data posterior ao valor',
    valueType: 'date',
  },
  status_equals: {
    operator: 'status_equals',
    label: 'Status igual',
    description: 'Status igual ao valor',
    valueType: 'select',
    options: [],
  },
  user_equals: {
    operator: 'user_equals',
    label: 'Usuário igual',
    description: 'Usuário responsável igual ao valor',
    valueType: 'select',
    options: [],
  },
  company_equals: {
    operator: 'company_equals',
    label: 'Empresa igual',
    description: 'Empresa é igual ao valor',
    valueType: 'select',
    options: [],
  },
};

export function getConditionDefinitions(): ConditionDefinition[] {
  return Object.values(conditionDefinitions);
}

export function getConditionDefinition(operator: ConditionOperator): ConditionDefinition {
  const def = conditionDefinitions[operator];
  if (!def) {
    throw new Error(`Condição não encontrada: ${operator}`);
  }
  return def;
}

export function resolveCondition(config: ConditionConfig, contextPayload: Record<string, unknown>): boolean {
  const fieldValue = contextPayload[config.field];
  const expectedValue = config.value;

  switch (config.operator) {
    case 'equals':
      return fieldValue === expectedValue;
    case 'not_equals':
      return fieldValue !== expectedValue;
    case 'greater_than':
      return Number(fieldValue) > Number(expectedValue);
    case 'less_than':
      return Number(fieldValue) < Number(expectedValue);
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
    case 'date_equals':
      return new Date(String(fieldValue)).toDateString() === new Date(String(expectedValue)).toDateString();
    case 'date_before':
      return new Date(String(fieldValue)) < new Date(String(expectedValue));
    case 'date_after':
      return new Date(String(fieldValue)) > new Date(String(expectedValue));
    case 'status_equals':
      return String(fieldValue).toUpperCase() === String(expectedValue).toUpperCase();
    case 'user_equals':
      return String(fieldValue) === String(expectedValue);
    case 'company_equals':
      return String(fieldValue) === String(expectedValue);
    default:
      return false;
  }
}
