export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i], 10) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i], 10) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10], 10);
}

export function isStrongPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Mínimo de 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Deve conter pelo menos uma letra maiúscula');
  if (!/[a-z]/.test(password)) errors.push('Deve conter pelo menos uma letra minúscula');
  if (!/[0-9]/.test(password)) errors.push('Deve conter pelo menos um número');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Deve conter pelo menos um caractere especial');
  return { valid: errors.length === 0, errors };
}

export function isValidEmailForDomain(email: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains?.length) return true;
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}
