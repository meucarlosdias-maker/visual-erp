export const DateFormats = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  INPUT: 'yyyy-MM-dd',
  SHORT: 'dd/MM',
  MONTH_YEAR: 'MM/yyyy',
} as const;

export const CurrencyFormats = {
  BRL: { locale: 'pt-BR', currency: 'BRL' },
  USD: { locale: 'en-US', currency: 'USD' },
  EUR: { locale: 'de-DE', currency: 'EUR' },
} as const;

export const NumberFormats = {
  PERCENT: { locale: 'pt-BR', style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  AREA: { locale: 'pt-BR', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  DECIMAL: { locale: 'pt-BR', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  INTEGER: { locale: 'pt-BR', minimumFractionDigits: 0, maximumFractionDigits: 0 },
} as const;

export const MaskPatterns = {
  PHONE: '(99) 99999-9999',
  CPF: '999.999.999-99',
  CNPJ: '99.999.999/9999-99',
  CEP: '99999-999',
  PLATE: 'AAA-9*99',
  DATE: '99/99/9999',
  CURRENCY: 'R$ 9.999,99',
} as const;
