import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    setRequestId: vi.fn(),
    setCorrelationId: vi.fn(),
  },
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: Record<string, unknown>) => body,
  },
}));

describe('Health Check API', () => {
  it('returns ok status with all fields', async () => {
    const { GET } = await import('@/app/api/health/route');
    const NextResponse = await import('next/server').then(m => m.NextResponse);
    // If NextResponse.json was not properly mocked, use a fallback
    const response = await GET();
    const data = response instanceof Response ? await response.json() : response;
    expect(data.status).toBe('ok');
    expect(data.version).toBe('1.0.0');
    expect(data.checks).toBeDefined();
    expect((data.checks as Record<string, string>).database).toBe('connected');
    expect(data.uptime).toBeDefined();
    expect(data.timestamp).toBeDefined();
  }, 15000);
});
