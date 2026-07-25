export const CALENDAR_EVENT_TYPE_LABELS: Record<string, string> = {
  VISIT: 'Visita',
  MEETING: 'Reunião',
  INSTALLATION: 'Instalação',
  PRODUCTION: 'Produção',
  DELIVERY: 'Entrega',
  PAYMENT: 'Pagamento',
  RECEIPT: 'Recebimento',
  INTERNAL: 'Interno',
  REMINDER: 'Lembrete',
  OTHER: 'Outro',
};

export const CALENDAR_EVENT_TYPE_COLORS: Record<string, string> = {
  VISIT: 'bg-blue-100 text-blue-700',
  MEETING: 'bg-purple-100 text-purple-700',
  INSTALLATION: 'bg-orange-100 text-orange-700',
  PRODUCTION: 'bg-indigo-100 text-indigo-700',
  DELIVERY: 'bg-green-100 text-green-700',
  PAYMENT: 'bg-red-100 text-red-700',
  RECEIPT: 'bg-emerald-100 text-emerald-700',
  INTERNAL: 'bg-gray-100 text-gray-700',
  REMINDER: 'bg-yellow-100 text-yellow-700',
  OTHER: 'bg-slate-100 text-slate-700',
};

export const CALENDAR_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em Andamento',
  FINISHED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const CALENDAR_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-orange-100 text-orange-700',
  FINISHED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};
