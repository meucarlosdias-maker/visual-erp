export const INSTALLATION_STATUS_LABELS: Record<string, string> = {
  PLANNING: 'Planejamento',
  SCHEDULED: 'Agendada',
  ON_ROUTE: 'A Caminho',
  IN_PROGRESS: 'Em Andamento',
  PAUSED: 'Pausada',
  FINISHED: 'Concluída',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelada',
};

export const INSTALLATION_STATUS_COLORS: Record<string, string> = {
  PLANNING: 'bg-blue-100 text-blue-700',
  SCHEDULED: 'bg-yellow-100 text-yellow-700',
  ON_ROUTE: 'bg-purple-100 text-purple-700',
  IN_PROGRESS: 'bg-cyan-100 text-cyan-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  FINISHED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};
