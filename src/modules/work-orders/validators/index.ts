export const WORK_ORDER_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Aberta',
  WAITING_APPROVAL: 'Aguardando Aprovação',
  APPROVED: 'Aprovada',
  IN_PRODUCTION: 'Em Produção',
  WAITING_INSTALLATION: 'Aguardando Instalação',
  INSTALLING: 'Instalando',
  FINISHED: 'Concluída',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelada',
};

export const WORK_ORDER_STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  WAITING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  IN_PRODUCTION: 'bg-indigo-100 text-indigo-700',
  WAITING_INSTALLATION: 'bg-purple-100 text-purple-700',
  INSTALLING: 'bg-orange-100 text-orange-700',
  FINISHED: 'bg-emerald-100 text-emerald-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export { PRIORITY_LABELS as WORK_ORDER_PRIORITY_LABELS, PRIORITY_COLORS as WORK_ORDER_PRIORITY_COLORS } from '@/constants/priorities';
