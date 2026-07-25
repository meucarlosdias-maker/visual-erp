export const PRODUCTION_ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  in_progress: 'Em Produção',
  paused: 'Pausada',
  finished: 'Concluída',
  cancelled: 'Cancelada',
};

export const PRODUCTION_ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  approved: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  paused: 'bg-orange-100 text-orange-700',
  finished: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};
