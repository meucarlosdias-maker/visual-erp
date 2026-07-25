export const QUOTATION_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  PENDING: 'Pendente',
  SENT: 'Enviado',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  EXPIRED: 'Expirado',
  CANCELLED: 'Cancelado',
};

export const QUOTATION_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SENT: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-orange-100 text-orange-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

export const DISCOUNT_TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: '%',
  VALUE: 'R$',
};
