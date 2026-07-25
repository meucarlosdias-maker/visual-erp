import { describe, it, expect } from 'vitest';
import { DateFormats, CurrencyFormats, NumberFormats, MaskPatterns } from '@/constants/formats';

describe('DateFormats', () => {
  it('has all required formats', () => {
    expect(DateFormats.DISPLAY).toBe('dd/MM/yyyy');
    expect(DateFormats.DISPLAY_TIME).toContain('HH:mm');
    expect(DateFormats.ISO).toContain('T');
    expect(DateFormats.INPUT).toBe('yyyy-MM-dd');
    expect(DateFormats.SHORT).toBe('dd/MM');
    expect(DateFormats.MONTH_YEAR).toBe('MM/yyyy');
  });
});

describe('CurrencyFormats', () => {
  it('has BRL config', () => {
    expect(CurrencyFormats.BRL.locale).toBe('pt-BR');
    expect(CurrencyFormats.BRL.currency).toBe('BRL');
  });

  it('has USD config', () => {
    expect(CurrencyFormats.USD.locale).toBe('en-US');
    expect(CurrencyFormats.USD.currency).toBe('USD');
  });

  it('has EUR config', () => {
    expect(CurrencyFormats.EUR.locale).toBe('de-DE');
    expect(CurrencyFormats.EUR.currency).toBe('EUR');
  });
});

describe('NumberFormats', () => {
  it('has PERCENT config', () => {
    expect(NumberFormats.PERCENT.style).toBe('percent');
  });

  it('has AREA config', () => {
    expect(NumberFormats.AREA.locale).toBe('pt-BR');
  });

  it('has INTEGER config', () => {
    expect(NumberFormats.INTEGER.maximumFractionDigits).toBe(0);
  });
});

describe('MaskPatterns', () => {
  it('has all mask patterns', () => {
    expect(MaskPatterns.PHONE).toContain('99999');
    expect(MaskPatterns.CPF).toContain('.');
    expect(MaskPatterns.CNPJ).toContain('/');
    expect(MaskPatterns.CEP).toContain('-');
    expect(MaskPatterns.PLATE).toContain('-');
    expect(MaskPatterns.DATE).toContain('/');
    expect(MaskPatterns.CURRENCY).toContain('R$');
  });
});
