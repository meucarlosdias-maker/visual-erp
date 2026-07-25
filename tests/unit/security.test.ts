import { describe, it, expect, beforeEach } from 'vitest';
import { sanitizeInput, sanitizeObject, validateEnvironment, RateLimiter } from '@/lib/security';

describe('sanitizeInput', () => {
  it('escapes HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('handles plain text', () => {
    expect(sanitizeInput('hello world')).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('sanitizeObject', () => {
  it('sanitizes all string values', () => {
    const obj = { name: '<b>bold</b>', desc: 'safe' };
    const result = sanitizeObject(obj);
    expect(result.name).toBe('&lt;b&gt;bold&lt;&#x2F;b&gt;');
    expect(result.desc).toBe('safe');
  });

  it('preserves non-string values', () => {
    const obj = { num: 42, flag: true, items: [1, 2] };
    const result = sanitizeObject(obj as Record<string, unknown>);
    expect(result.num).toBe(42);
    expect(result.flag).toBe(true);
    expect(result.items).toEqual([1, 2]);
  });
});

describe('validateEnvironment', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it('returns missing vars', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const missing = validateEnvironment();
    expect(missing).toContain('NEXT_PUBLIC_SUPABASE_URL');
  });

  it('returns empty array when all set', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/db';
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    const missing = validateEnvironment();
    expect(missing).toHaveLength(0);
  });
});

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(3, 5000);
  });

  it('allows requests within limit', () => {
    expect(limiter.check('ip-1')).toBe(true);
    expect(limiter.check('ip-1')).toBe(true);
    expect(limiter.check('ip-1')).toBe(true);
  });

  it('blocks requests exceeding limit', () => {
    limiter.check('ip-1');
    limiter.check('ip-1');
    limiter.check('ip-1');
    expect(limiter.check('ip-1')).toBe(false);
  });

  it('tracks different keys separately', () => {
    for (let i = 0; i < 3; i++) limiter.check('ip-1');
    expect(limiter.check('ip-2')).toBe(true);
    expect(limiter.check('ip-1')).toBe(false);
  });

  it('returns remaining count', () => {
    expect(limiter.getRemaining('ip-1')).toBe(3);
    limiter.check('ip-1');
    expect(limiter.getRemaining('ip-1')).toBe(2);
  });

  it('resets after window expires', async () => {
    limiter = new RateLimiter(1, 100);
    limiter.check('ip-1');
    expect(limiter.check('ip-1')).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(limiter.check('ip-1')).toBe(true);
  });

  it('clears all entries', () => {
    limiter.check('ip-1');
    limiter.check('ip-2');
    limiter.clear();
    expect(limiter.getRemaining('ip-1')).toBe(3);
    expect(limiter.getRemaining('ip-2')).toBe(3);
  });
});
