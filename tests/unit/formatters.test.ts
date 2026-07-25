import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatNumber, formatPercent } from '@/utils/helpers';
import { CurrencyFormats } from '@/constants/formats';

describe('formatters with constants', () => {
  it('formatCurrency with BRL config', () => {
    const result = formatCurrency(2500, CurrencyFormats.BRL.locale, CurrencyFormats.BRL.currency);
    expect(result).toContain('R$');
    expect(result).toContain('2.500');
  });

  it('formatCurrency with USD config', () => {
    const result = formatCurrency(99.99, CurrencyFormats.USD.locale, CurrencyFormats.USD.currency);
    expect(result).toContain('$');
  });

  it('formatNumber handles integer config', () => {
    const result = formatNumber(100);
    expect(result).toContain('100');
  });

  it('formatPercent handles percentage', () => {
    const result = formatPercent(0.15);
    expect(result).toContain('15');
  });

  it('formatDate handles various inputs', () => {
    expect(formatDate(new Date(2024, 0, 1))).toBe('01/01/2024');
    expect(formatDate(new Date(2024, 11, 31))).toBe('31/12/2024');
  });
});
