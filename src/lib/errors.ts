export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      code: this.code,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fieldErrors?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      fieldErrors: this.fieldErrors,
    };
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    const msg = id ? `${entity} com ID ${id} não encontrado` : `${entity} não encontrado`;
    super(msg, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class PermissionError extends AppError {
  constructor(message = 'Acesso não autorizado') {
    super(message, 403, 'PERMISSION_DENIED');
    this.name = 'PermissionError';
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_RULE');
    this.name = 'BusinessRuleError';
  }
}

export class InfrastructureError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message, 500, 'INFRASTRUCTURE_ERROR');
    this.name = 'InfrastructureError';
  }
}
