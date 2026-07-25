import { z } from 'zod';
import { unformat } from '@/utils/helpers';

export const phoneSchema = z
  .string()
  .min(14, 'Telefone inválido')
  .or(z.string().length(0));

export const emailSchema = z
  .string()
  .email('E-mail inválido')
  .or(z.string().length(0));

export const cpfSchema = z.string().refine(
  (value) => {
    const digits = unformat(value);
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    if (rest !== parseInt(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10) rest = 0;
    return rest === parseInt(digits[10]);
  },
  { message: 'CPF inválido' },
);

export const cnpjSchema = z.string().refine(
  (value) => {
    const digits = unformat(value);
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false;
    let sum = 0;
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * weights1[i];
    let rest = sum % 11;
    if (rest < 2) rest = 0;
    else rest = 11 - rest;
    if (rest !== parseInt(digits[12])) return false;
    sum = 0;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * weights2[i];
    rest = sum % 11;
    if (rest < 2) rest = 0;
    else rest = 11 - rest;
    return rest === parseInt(digits[13]);
  },
  { message: 'CNPJ inválido' },
);

export const documentSchema = z.union([cpfSchema, cnpjSchema]);
