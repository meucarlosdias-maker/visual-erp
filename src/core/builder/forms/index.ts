import type { FieldDefinition, CustomEntityRecord, ValidationConfig, FieldType } from '../types';

function validateCPF(value: string): boolean {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(cpf[10]);
}

function validateCNPJ(value: string): boolean {
  const cnpj = value.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(cnpj[i]) * w1[i];
  let remainder = sum % 11;
  if (remainder < 2) remainder = 0; else remainder = 11 - remainder;
  if (remainder !== parseInt(cnpj[12])) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(cnpj[i]) * w2[i];
  remainder = sum % 11;
  if (remainder < 2) remainder = 0; else remainder = 11 - remainder;
  return remainder === parseInt(cnpj[13]);
}

function validatePhone(value: string): boolean {
  const phone = value.replace(/\D/g, '');
  return phone.length >= 10 && phone.length <= 11;
}

function validateURL(value: string): boolean {
  try { new URL(value); return true; }
  catch { return false; }
}

export const FormValidator = {
  validateField(field: FieldDefinition, value: unknown): string | null {
    const stringValue = String(value ?? '');

    if (field.required && (!value || stringValue.trim() === '')) {
      return `${field.label} é obrigatório`;
    }

    if (!value || stringValue.trim() === '') return null;

    for (const v of field.validations) {
      const error = FormValidator.applyRule(v, stringValue, field);
      if (error) return error;
    }

    return null;
  },

  applyRule(validation: ValidationConfig, value: string, _field: FieldDefinition): string | null {
    const msg = validation.message;

    switch (validation.rule) {
      case 'required':
        if (!value || value.trim() === '') return msg ?? 'Campo obrigatório';
        break;
      case 'min':
        if (isFinite(Number(value)) && Number(value) < Number(validation.value)) {
          return msg ?? `Valor mínimo é ${validation.value}`;
        }
        break;
      case 'max':
        if (isFinite(Number(value)) && Number(value) > Number(validation.value)) {
          return msg ?? `Valor máximo é ${validation.value}`;
        }
        break;
      case 'regex':
        if (validation.value && !new RegExp(String(validation.value)).test(value)) {
          return msg ?? 'Formato inválido';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return msg ?? 'Email inválido';
        }
        break;
      case 'url':
        if (!validateURL(value)) return msg ?? 'URL inválida';
        break;
      case 'cpf':
        if (!validateCPF(value)) return msg ?? 'CPF inválido';
        break;
      case 'cnpj':
        if (!validateCNPJ(value)) return msg ?? 'CNPJ inválido';
        break;
      case 'phone':
        if (!validatePhone(value)) return msg ?? 'Telefone inválido';
        break;
      case 'date':
        if (isNaN(Date.parse(value))) return msg ?? 'Data inválida';
        break;
    }
    return null;
  },

  validateForm(fields: FieldDefinition[], data: Record<string, unknown>): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of fields) {
      const error = FormValidator.validateField(field, data[field.name]);
      if (error) errors[field.name] = error;
    }
    return errors;
  },
};

export const FormEngine = {
  buildDefaultValues(fields: FieldDefinition[]): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.defaultValue !== null) {
        values[field.name] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        values[field.name] = false;
      } else if (field.type === 'switch') {
        values[field.name] = false;
      } else if (field.type === 'multiselect') {
        values[field.name] = [];
      } else {
        values[field.name] = '';
      }
    }
    return values;
  },

  formatValue(value: unknown, type: FieldType): string {
    if (value === null || value === undefined) return '';
    if (type === 'currency') {
      const num = Number(value);
      return isNaN(num) ? String(value) : num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (type === 'date') {
      const d = new Date(String(value));
      return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('pt-BR');
    }
    if (type === 'datetime') {
      const d = new Date(String(value));
      return isNaN(d.getTime()) ? String(value) : d.toLocaleString('pt-BR');
    }
    if (type === 'document') {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 11) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      if (digits.length === 14) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      return String(value);
    }
    if (type === 'phone') {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length === 11) return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      return String(value);
    }
    return String(value);
  },
};
