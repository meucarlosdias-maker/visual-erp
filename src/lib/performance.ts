import { logger } from './logger';

export function logBundleSize(componentName: string, size: number) {
  logger.info(`Bundle: ${componentName}`, { sizeBytes: size });
}

export function shouldLazyLoad(componentWeight: number, threshold = 50_000): boolean {
  return componentWeight > threshold;
}

export function createPaginationParams(page: number, pageSize = 20) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

export function debounceAsync<T>(
  fn: (...args: unknown[]) => Promise<T>,
  ms = 300,
): (...args: unknown[]) => Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  let rejectLast: ((reason: Error) => void) | null = null;

  return (...args: unknown[]) =>
    new Promise<T>((resolve, reject) => {
      if (rejectLast) {
        rejectLast(new Error('Debounced call replaced'));
      }
      rejectLast = reject;
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (err) {
          reject(err as Error);
        }
      }, ms);
    });
}
