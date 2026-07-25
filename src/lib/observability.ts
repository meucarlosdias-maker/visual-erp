import { logger } from './logger';

export interface PerformanceMetric {
  operation: string;
  durationMs: number;
  timestamp: string;
  success: boolean;
  data?: Record<string, unknown>;
}

export function trackPerformance(
  operation: string,
  durationMs: number,
  success: boolean,
  data?: Record<string, unknown>,
): PerformanceMetric {
  const metric: PerformanceMetric = {
    operation,
    durationMs,
    timestamp: new Date().toISOString(),
    success,
    data: data ? { ...data } : undefined,
  };
  if (durationMs > 1000) {
    logger.warn(`Slow operation: ${operation}`, {
      durationMs,
      ...data,
    });
  }
  logger.debug(`Performance: ${operation}`, {
    durationMs,
    success,
    ...data,
  });
  return metric;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export class ErrorTracker {
  private errors: Array<{ error: Error; context?: Record<string, unknown>; timestamp: string }> = [];

  track(error: Error, context?: Record<string, unknown>) {
    this.errors.push({
      error,
      context,
      timestamp: new Date().toISOString(),
    });
    logger.error(error.message, {
      name: error.name,
      stack: error.stack,
      ...context,
    });
  }

  getRecent(count = 10): typeof this.errors {
    return this.errors.slice(-count);
  }

  clear() {
    this.errors = [];
  }
}

export const errorTracker = new ErrorTracker();
