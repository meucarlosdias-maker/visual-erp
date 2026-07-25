export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', options ?? { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

export function formatMoney(value: string): string {
  const digits = value.replace(/\D/g, '');
  const int = digits.slice(0, -2) || '0';
  const dec = digits.slice(-2).padStart(2, '0');
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(int) + Number(dec) / 100);
  return formatted;
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function unformat(value: string): string {
  return value.replace(/\D/g, '');
}

export function identifyDocument(value: string): 'cpf' | 'cnpj' {
  const digits = value.replace(/\D/g, '');
  return digits.length <= 11 ? 'cpf' : 'cnpj';
}

export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatPercentage(value: string): string {
  const digits = value.replace(/\D/g, '');
  const int = digits.slice(0, -2) || '0';
  const dec = digits.slice(-2).padStart(2, '0');
  return `${int},${dec}%`;
}

export function formatArea(value: string): string {
  const digits = value.replace(/\D/g, '');
  const int = digits.slice(0, -2) || '0';
  const dec = digits.slice(-2).padStart(2, '0');
  return `${int},${dec} m²`;
}

export function formatLinearMeter(value: string): string {
  const digits = value.replace(/\D/g, '');
  const int = digits.slice(0, -2) || '0';
  const dec = digits.slice(-2).padStart(2, '0');
  return `${int},${dec} m`;
}

export function formatLicensePlate(value: string): string {
  const upper = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  if (upper.length <= 3) return upper;
  return `${upper.slice(0, 3)}-${upper.slice(3)}`;
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function generateSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms = 300): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function downloadFile(url: string, filename?: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename ?? '';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
