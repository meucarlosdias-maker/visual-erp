import { describe, it, expect } from 'vitest';
import { cpfSchema, cnpjSchema, documentSchema, emailSchema, phoneSchema } from '@/utils/validators';

describe('cpfSchema', () => {
  it('validates correct CPF', () => {
    const result = cpfSchema.safeParse('529.982.247-25');
    expect(result.success).toBe(true);
  });

  it('rejects invalid CPF', () => {
    const result = cpfSchema.safeParse('111.111.111-11');
    expect(result.success).toBe(false);
  });

  it('rejects short CPF', () => {
    const result = cpfSchema.safeParse('123.456');
    expect(result.success).toBe(false);
  });

  it('rejects empty string when no .or() needed', () => {
    const result = cpfSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('rejects non-digit characters', () => {
    const result = cpfSchema.safeParse('abc.def.ghi-jk');
    expect(result.success).toBe(false);
  });
});

describe('cnpjSchema', () => {
  it('validates correct CNPJ', () => {
    const result = cnpjSchema.safeParse('11.222.333/0001-81');
    expect(result.success).toBe(true);
  });

  it('rejects invalid CNPJ', () => {
    const result = cnpjSchema.safeParse('11.111.111/1111-11');
    expect(result.success).toBe(false);
  });

  it('rejects short CNPJ', () => {
    const result = cnpjSchema.safeParse('11.222');
    expect(result.success).toBe(false);
  });

  it('rejects empty string', () => {
    const result = cnpjSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

describe('emailSchema', () => {
  it('validates correct email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });

  it('accepts empty string', () => {
    expect(emailSchema.safeParse('').success).toBe(true);
  });
});

describe('phoneSchema', () => {
  it('validates phone with sufficient length', () => {
    const result = phoneSchema.safeParse('(11) 99999-8888');
    expect(result.success).toBe(true);
  });

  it('accepts empty string', () => {
    expect(phoneSchema.safeParse('').success).toBe(true);
  });
});

describe('documentSchema', () => {
  it('validates CPF', () => {
    const result = documentSchema.safeParse('529.982.247-25');
    expect(result.success).toBe(true);
  });

  it('validates CNPJ', () => {
    const result = documentSchema.safeParse('11.222.333/0001-81');
    expect(result.success).toBe(true);
  });

  it('rejects invalid document', () => {
    const result = documentSchema.safeParse('00.000.000/0000-00');
    expect(result.success).toBe(false);
  });
});
