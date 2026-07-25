import {
  formatMoney,
  formatPhone,
  formatCPF,
  formatCNPJ,
  formatCEP,
  formatPercentage,
  formatArea,
  formatLinearMeter,
  formatLicensePlate,
  unformat,
  identifyDocument,
} from '@/utils/helpers';

export type MaskType =
  | 'money'
  | 'phone'
  | 'cpf'
  | 'cnpj'
  | 'document'
  | 'cep'
  | 'percentage'
  | 'area'
  | 'linear_meter'
  | 'license_plate';

export function applyMask(value: string, mask: MaskType): string {
  switch (mask) {
    case 'money':
      return formatMoney(value);
    case 'phone':
      return formatPhone(value);
    case 'cpf':
      return formatCPF(value);
    case 'cnpj':
      return formatCNPJ(value);
    case 'document': {
      const type = identifyDocument(value);
      return type === 'cpf' ? formatCPF(value) : formatCNPJ(value);
    }
    case 'cep':
      return formatCEP(value);
    case 'percentage':
      return formatPercentage(value);
    case 'area':
      return formatArea(value);
    case 'linear_meter':
      return formatLinearMeter(value);
    case 'license_plate':
      return formatLicensePlate(value);
    default:
      return value;
  }
}

export function removeMask(value: string): string {
  return unformat(value);
}

export { unformat, identifyDocument };
