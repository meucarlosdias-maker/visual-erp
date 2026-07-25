export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (typeof val === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeInput(val);
    }
  }
  return result;
}

export function validateEnvironment(): string[] {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL',
    'NEXT_PUBLIC_SITE_URL',
  ];
  const missing: string[] = [];
  for (const v of requiredVars) {
    if (!process.env[v]) {
      missing.push(v);
    }
  }
  return missing;
}

export class RateLimiter {
  private store: Map<string, { count: number; resetAt: number }> = new Map();

  constructor(
    private maxRequests: number = 10,
    private windowMs: number = 60000,
  ) {}

  check(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemaining(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return this.maxRequests;
    return Math.max(0, this.maxRequests - entry.count);
  }

  clear() {
    this.store.clear();
  }
}

export const rateLimiter = new RateLimiter();
