import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    setRequestId: vi.fn(),
    setCorrelationId: vi.fn(),
  },
}));

import { getHealthStatus, logResourceUsage } from '@/lib/monitoring';

describe('getHealthStatus', () => {
  it('returns ok when db connected and memory healthy', () => {
    const status = getHealthStatus(true);
    expect(status.status).toBe('ok');
    expect(status.version).toBe('1.0.0');
    expect(status.checks.database).toBe('connected');
    expect(status.checks.memory).toBeDefined();
    expect(status.timestamp).toBeDefined();
  });

  it('returns degraded when db disconnected', () => {
    const status = getHealthStatus(false);
    expect(status.checks.database).toBe('disconnected');
  });
});

describe('logResourceUsage', () => {
  it('runs without error', () => {
    expect(() => logResourceUsage()).not.toThrow();
  });
});
