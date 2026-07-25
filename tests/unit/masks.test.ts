import { describe, it, expect } from 'vitest';
import { applyMask, removeMask, unformat, identifyDocument } from '@/utils/masks';

describe('applyMask', () => {
  it('applies money mask', () => {
    const result = applyMask('150050', 'money');
    expect(result).toContain(',');
  });

  it('applies phone mask', () => {
    expect(applyMask('11999998888', 'phone')).toBe('(11) 99999-8888');
  });

  it('applies CPF mask', () => {
    expect(applyMask('12345678909', 'cpf')).toBe('123.456.789-09');
  });

  it('applies CNPJ mask', () => {
    expect(applyMask('11222333000181', 'cnpj')).toBe('11.222.333/0001-81');
  });

  it('applies document mask for CPF', () => {
    expect(applyMask('12345678909', 'document')).toBe('123.456.789-09');
  });

  it('applies document mask for CNPJ', () => {
    expect(applyMask('11222333000181', 'document')).toBe('11.222.333/0001-81');
  });

  it('applies CEP mask', () => {
    expect(applyMask('01310100', 'cep')).toBe('01310-100');
  });

  it('applies percentage mask', () => {
    const result = applyMask('2550', 'percentage');
    expect(result).toContain('%');
  });

  it('applies area mask', () => {
    const result = applyMask('5000', 'area');
    expect(result).toContain('m²');
  });

  it('applies linear meter mask', () => {
    const result = applyMask('1000', 'linear_meter');
    expect(result).toContain('m');
  });

  it('applies license plate mask', () => {
    expect(applyMask('abc1a23', 'license_plate')).toBe('ABC-1A23');
  });

  it('returns value for unknown mask', () => {
    expect(applyMask('test', 'unknown' as never)).toBe('test');
  });
});

describe('removeMask', () => {
  it('removes mask from phone', () => {
    expect(removeMask('(11) 99999-8888')).toBe('11999998888');
  });

  it('removes mask from CPF', () => {
    expect(removeMask('123.456.789-09')).toBe('12345678909');
  });

  it('removes mask from CNPJ', () => {
    expect(removeMask('11.222.333/0001-81')).toBe('11222333000181');
  });
});

describe('unformat', () => {
  it('extracts digits', () => {
    expect(unformat('ABC-1234')).toBe('1234');
  });
});

describe('identifyDocument', () => {
  it('identifies CPF from masked string', () => {
    expect(identifyDocument('123.456.789-09')).toBe('cpf');
  });

  it('identifies CNPJ from masked string', () => {
    expect(identifyDocument('11.222.333/0001-81')).toBe('cnpj');
  });
});
