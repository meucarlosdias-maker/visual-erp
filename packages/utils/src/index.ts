export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === 'short' ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : format === 'long' ? { day: '2-digit', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleDateString('pt-BR', options);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatDocument(doc: string): string {
  const cleaned = doc.replace(/\D/g, '');
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  return doc;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function statusLabel(status: string, labels: Record<string, string>): string {
  return labels[status] ?? status;
}

export const quotationStatusLabels: Record<string, string> = {
  DRAFT: 'Rascunho',
  PENDING: 'Pendente',
  SENT: 'Enviado',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
};

export const projectStatusLabels: Record<string, string> = {
  WAITING: 'Aguardando',
  PLANNING: 'Planejamento',
  IN_PRODUCTION: 'Em Produção',
  WAITING_INSTALLATION: 'Aguardando Instalação',
  INSTALLING: 'Instalando',
  FINISHED: 'Finalizado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'gray',
    PENDING: 'yellow',
    SENT: 'blue',
    APPROVED: 'green',
    REJECTED: 'red',
    EXPIRED: 'orange',
    CANCELLED: 'gray',
    WAITING: 'gray',
    PLANNING: 'blue',
    IN_PRODUCTION: 'purple',
    WAITING_INSTALLATION: 'yellow',
    INSTALLING: 'blue',
    FINISHED: 'green',
    DELIVERED: 'green',
  };
  return colors[status] ?? 'gray';
}
