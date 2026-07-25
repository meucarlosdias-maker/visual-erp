export const PROJECT_STATUS_LABELS: Record<string, string> = {
  WAITING: 'Aguardando',
  PLANNING: 'Planejamento',
  IN_PRODUCTION: 'Em Produção',
  WAITING_INSTALLATION: 'Aguardando Instalação',
  INSTALLING: 'Instalando',
  FINISHED: 'Finalizado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export const PROJECT_STATUS_COLORS: Record<string, string> = {
  WAITING: 'bg-yellow-100 text-yellow-700',
  PLANNING: 'bg-blue-100 text-blue-700',
  IN_PRODUCTION: 'bg-purple-100 text-purple-700',
  WAITING_INSTALLATION: 'bg-orange-100 text-orange-700',
  INSTALLING: 'bg-cyan-100 text-cyan-700',
  FINISHED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  WAITING: 'Aguardando',
  IN_PROGRESS: 'Em Andamento',
  PAUSED: 'Pausado',
  FINISHED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  WAITING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  FINISHED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export { PRIORITY_LABELS, PRIORITY_COLORS } from '@/constants/priorities';

export const DEPARTMENTS_SEED = [
  { name: 'Projetos', description: 'Criação e planejamento de projetos', color: '#3b82f6', icon: 'FolderKanban', sortOrder: 1 },
  { name: 'Design', description: 'Arte e design gráfico', color: '#8b5cf6', icon: 'Palette', sortOrder: 2 },
  { name: 'Impressão', description: 'Impressão digital e serigráfica', color: '#06b6d4', icon: 'Printer', sortOrder: 3 },
  { name: 'Fábrica', description: 'Produção industrial', color: '#f59e0b', icon: 'Factory', sortOrder: 4 },
  { name: 'Instalação', description: 'Instalação em campo', color: '#10b981', icon: 'HardHat', sortOrder: 5 },
  { name: 'Expedição', description: 'Logística e entrega', color: '#ef4444', icon: 'Truck', sortOrder: 6 },
] as const;
