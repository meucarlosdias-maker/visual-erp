export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface PaginatedActionResponse<T> extends ActionResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function successResponse<T>(data: T, message = 'Operação realizada com sucesso'): ActionResponse<T> {
  return { success: true, message, data };
}

export function errorResponse(message: string, errors?: Record<string, string>): ActionResponse<never> {
  return { success: false, message, errors };
}

export function paginatedSuccessResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Operação realizada com sucesso',
): PaginatedActionResponse<T> {
  return {
    success: true,
    message,
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
