export function isValidCNPJ(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;
  let sum = 0;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * weights1[i];
  let rest = sum % 11;
  if (rest < 2) rest = 0; else rest = 11 - rest;
  if (rest !== parseInt(digits[12])) return false;
  sum = 0;
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * weights2[i];
  rest = sum % 11;
  if (rest < 2) rest = 0; else rest = 11 - rest;
  return rest === parseInt(digits[13]);
}

export function isValidIE(ie: string, state: string): boolean {
  const digits = ie.replace(/\D/g, '');
  if (!digits) return true;
  const stateRules: Record<string, RegExp> = {
    SP: /^\d{12}$/,
    RJ: /^\d{8}$/,
    MG: /^\d{13}$/,
    RS: /^\d{10}$/,
    PR: /^\d{10}$/,
    SC: /^\d{9}$/,
    BA: /^\d{9}$/,
  };
  const rule = stateRules[state];
  if (!rule) return digits.length >= 8 && digits.length <= 14;
  return rule.test(digits);
}

export function isValidPixKey(key: string, type: string): boolean {
  switch (type) {
    case 'CPF':
      return /^\d{11}$/.test(key.replace(/\D/g, ''));
    case 'CNPJ':
      return /^\d{14}$/.test(key.replace(/\D/g, ''));
    case 'EMAIL':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
    case 'PHONE':
      return /^\+55\d{10,11}$/.test(key.replace(/[^\d+]/g, ''));
    case 'RANDOM':
      return key.length >= 10;
    default:
      return false;
  }
}

export function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
