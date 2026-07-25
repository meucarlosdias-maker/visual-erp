import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatMoney,
  formatPhone,
  formatCPF,
  formatCNPJ,
  unformat,
  identifyDocument,
  formatCEP,
  formatPercentage,
  formatArea,
  formatLinearMeter,
  formatLicensePlate,
  formatPercent,
  generateSlug,
  debounce,
  sleep,
  downloadFile,
} from '@/utils/helpers';

describe('formatCurrency', () => {
  it('formats BRL currency', () => {
    const result = formatCurrency(1500.5);
    expect(result).toContain('R$');
    expect(result).toContain('1.500');
    expect(result).toContain('50');
  });

  it('formats USD currency', () => {
    const result = formatCurrency(99.99, 'en-US', 'USD');
    expect(result).toContain('$');
    expect(result).toContain('99.99');
  });
});

describe('formatDate', () => {
  it('formats Date object', () => {
    const d = new Date(2024, 0, 15);
    const result = formatDate(d);
    expect(result).toBe('15/01/2024');
  });

  it('formats string date', () => {
    const d = new Date('2024-06-20T12:00:00');
    const result = formatDate(d);
    expect(result).toBe('20/06/2024');
  });

  it('uses custom options', () => {
    const result = formatDate(new Date(2024, 11, 25), { month: 'long' });
    expect(result).toContain('dezembro');
  });
});

describe('formatNumber', () => {
  it('formats with default 2 decimals', () => {
    expect(formatNumber(1234.5)).toContain('1.234');
    expect(formatNumber(1234.5)).toContain(',');
    expect(formatNumber(1)).toContain('1,00');
  });

  it('formats with custom decimals', () => {
    const result = formatNumber(3.14159, 3);
    expect(result).toContain(',');
  });
});

describe('formatMoney', () => {
  it('parses digit string to BRL format', () => {
    const result = formatMoney('150050');
    expect(result).toContain('1.500');
    expect(result).toContain(',');
  });

  it('handles small values', () => {
    expect(formatMoney('50')).toContain('0,50');
  });

  it('handles empty string', () => {
    expect(formatMoney('')).toContain('0,00');
  });
});

describe('formatPhone', () => {
  it('formats 11-digit phone', () => {
    expect(formatPhone('11999998888')).toBe('(11) 99999-8888');
  });

  it('formats 10-digit phone', () => {
    expect(formatPhone('1133334444')).toBe('(11) 33334-444');
  });

  it('handles partial input', () => {
    expect(formatPhone('11')).toBe('(11');
  });
});

describe('formatCPF', () => {
  it('formats 11 digits', () => {
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  it('handles partial input', () => {
    expect(formatCPF('123')).toBe('123');
    expect(formatCPF('123456')).toBe('123.456');
  });
});

describe('formatCNPJ', () => {
  it('formats 14 digits', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('handles partial input', () => {
    expect(formatCNPJ('11')).toBe('11');
    expect(formatCNPJ('11222')).toBe('11.222');
  });
});

describe('unformat', () => {
  it('removes non-digits', () => {
    expect(unformat('(11) 99999-8888')).toBe('11999998888');
    expect(unformat('123.456.789-09')).toBe('12345678909');
    expect(unformat('R$ 1.500,50')).toBe('150050');
  });
});

describe('identifyDocument', () => {
  it('identifies CPF', () => {
    expect(identifyDocument('12345678909')).toBe('cpf');
    expect(identifyDocument('1234567890')).toBe('cpf');
  });

  it('identifies CNPJ', () => {
    expect(identifyDocument('11222333000181')).toBe('cnpj');
  });
});

describe('formatCEP', () => {
  it('formats 8 digits', () => {
    expect(formatCEP('01310100')).toBe('01310-100');
  });

  it('handles partial', () => {
    expect(formatCEP('01310')).toBe('01310');
  });
});

describe('formatPercentage', () => {
  it('formats percentage string', () => {
    expect(formatPercentage('2550')).toContain('25,50%');
  });
});

describe('formatArea', () => {
  it('formats area string', () => {
    const result = formatArea('5000');
    expect(result).toContain('m²');
  });
});

describe('formatLinearMeter', () => {
  it('formats linear meter', () => {
    const result = formatLinearMeter('1000');
    expect(result).toContain('m');
  });
});

describe('formatLicensePlate', () => {
  it('formats Mercosul plate', () => {
    expect(formatLicensePlate('abc1a23')).toBe('ABC-1A23');
  });

  it('formats old plate', () => {
    expect(formatLicensePlate('abc1234')).toBe('ABC-1234');
  });
});

describe('formatPercent', () => {
  it('formats ratio as percent', () => {
    const result = formatPercent(0.25);
    expect(result).toContain('25');
  });
});

describe('generateSlug', () => {
  it('generates slug from text', () => {
    expect(generateSlug('Olá Mundo!')).toBe('ola-mundo');
    expect(generateSlug('  Teste   com  espaços  ')).toBe('-teste-com-espacos-');
    expect(generateSlug('Café & Cia')).toBe('cafe-cia');
  });
});

describe('debounce', () => {
  it('delays execution', async () => {
    let called = 0;
    const fn = debounce(() => { called++; }, 50);
    fn();
    fn();
    fn();
    expect(called).toBe(0);
    await sleep(100);
    expect(called).toBe(1);
  });
});

describe('sleep', () => {
  it('resolves after given ms', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });
});

describe('downloadFile', () => {
  it('creates and removes anchor element', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');
    downloadFile('https://example.com/file.pdf', 'file.pdf');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
