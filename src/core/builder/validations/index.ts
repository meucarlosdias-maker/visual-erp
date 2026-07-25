import type { ValidationRule, ValidationConfig, FieldType } from '../types';

export const ValidationEngine = {
  getAvailableRules(fieldType: FieldType): { rule: ValidationRule; label: string }[] {
    const rules: { rule: ValidationRule; label: string }[] = [];

    rules.push({ rule: 'required', label: 'Obrigatório' });

    if (['number', 'currency'].includes(fieldType)) {
      rules.push({ rule: 'min', label: 'Valor mínimo' });
      rules.push({ rule: 'max', label: 'Valor máximo' });
    }

    rules.push({ rule: 'regex', label: 'Regex' });

    if (fieldType === 'email') rules.push({ rule: 'email', label: 'Email' });
    if (fieldType === 'text') rules.push({ rule: 'url', label: 'URL' });
    if (fieldType === 'document') {
      rules.push({ rule: 'cpf', label: 'CPF' });
      rules.push({ rule: 'cnpj', label: 'CNPJ' });
    }
    if (fieldType === 'phone') rules.push({ rule: 'phone', label: 'Telefone' });
    if (['date', 'datetime'].includes(fieldType)) rules.push({ rule: 'date', label: 'Data' });
    if (fieldType === 'file') rules.push({ rule: 'file', label: 'Arquivo' });
    if (fieldType === 'image') rules.push({ rule: 'image', label: 'Imagem' });

    return rules;
  },

  createValidation(rule: ValidationRule, value?: string | number, message?: string): ValidationConfig {
    return { rule, value, message };
  },

  validateConfig(config: ValidationConfig): string | null {
    if (config.rule === 'required') return null;
    if (config.rule === 'regex' && !config.value) return 'Regex requer um padrão';
    if ((config.rule === 'min' || config.rule === 'max') && config.value === undefined) {
      return 'Valor mínimo/máximo requer um número';
    }
    return null;
  },
};
