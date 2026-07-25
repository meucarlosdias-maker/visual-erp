export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contactado',
  QUALIFIED: 'Qualificado',
  VISIT_SCHEDULED: 'Visita Agendada',
  VISITED: 'Visitado',
  PROPOSAL_SENT: 'Proposta Enviada',
  NEGOTIATION: 'Negociação',
  WON: 'Ganho',
  LOST: 'Perdido',
  ARCHIVED: 'Arquivado',
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  QUALIFIED: 'bg-indigo-100 text-indigo-700',
  VISIT_SCHEDULED: 'bg-purple-100 text-purple-700',
  VISITED: 'bg-teal-100 text-teal-700',
  PROPOSAL_SENT: 'bg-cyan-100 text-cyan-700',
  NEGOTIATION: 'bg-orange-100 text-orange-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

export const LEAD_TEMPERATURE_LABELS: Record<string, string> = {
  COLD: 'Frio',
  WARM: 'Morno',
  HOT: 'Quente',
};

export const LEAD_TEMPERATURE_COLORS: Record<string, string> = {
  COLD: 'bg-blue-100 text-blue-700',
  WARM: 'bg-orange-100 text-orange-700',
  HOT: 'bg-red-100 text-red-700',
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  CALL: 'Ligação',
  EMAIL: 'E-mail',
  WHATSAPP: 'WhatsApp',
  MEETING: 'Reunião',
  VISIT: 'Visita',
  NOTE: 'Anotação',
};

export const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  CALL: 'bg-blue-100 text-blue-700',
  EMAIL: 'bg-indigo-100 text-indigo-700',
  WHATSAPP: 'bg-emerald-100 text-emerald-700',
  MEETING: 'bg-purple-100 text-purple-700',
  VISIT: 'bg-teal-100 text-teal-700',
  NOTE: 'bg-gray-100 text-gray-700',
};

export const VISIT_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Agendada',
  IN_PROGRESS: 'Em Andamento',
  FINISHED: 'Concluída',
  CANCELLED: 'Cancelada',
};

export const VISIT_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  FINISHED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};
