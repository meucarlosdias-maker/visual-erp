/**
 * Health Check Library
 *
 * Runtime health-check logic for the /api/health endpoint.
 * Each service check returns a HealthCheckServiceResult; the aggregator
 * produces a HealthCheckResult with overall status.
 *
 * Usage in an API route:
 *   import { runHealthCheck } from '@/scripts/health-check';
 *   const result = await runHealthCheck();
 *   return Response.json(result, { status: result.status === 'healthy' ? 200 : 503 });
 */

const START_TIME = Date.now();

// ─── Types ───────────────────────────────────────────────────────────

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheckServiceResult {
  status: HealthStatus;
  message: string;
  latencyMs: number;
}

export interface HealthCheckChecks {
  database: HealthCheckServiceResult;
  api: HealthCheckServiceResult;
  storage: HealthCheckServiceResult;
  auth: HealthCheckServiceResult;
  queue: HealthCheckServiceResult;
}

export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  version: string;
  uptime: number;
  checks: HealthCheckChecks;
}

// ─── Individual check implementations ───────────────────────────────

async function measure<T>(fn: () => Promise<T>): Promise<{ result: T; latencyMs: number }> {
  const start = performance.now();
  const result = await fn();
  return { result, latencyMs: Math.round(performance.now() - start) };
}

export async function checkDatabase(): Promise<HealthCheckServiceResult> {
  const { latencyMs } = await measure(async () => {
    const prisma = new (await import('@prisma/client')).PrismaClient();
    try {
      await prisma.$queryRaw`SELECT 1`;
    } finally {
      await prisma.$disconnect();
    }
  });

  return {
    status: 'healthy',
    message: 'Database connection established',
    latencyMs,
  };
}

export async function checkApi(): Promise<HealthCheckServiceResult> {
  const { latencyMs } = await measure(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/health/ping`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error(`API ping returned ${response.status}`);
    }
  });

  return {
    status: 'healthy',
    message: 'API is responding',
    latencyMs,
  };
}

export async function checkStorage(): Promise<HealthCheckServiceResult> {
  const { latencyMs } = await measure(async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'visual-erp-uploads';
    const { error } = await supabase.storage.getBucket(bucket);

    if (error) {
      throw error;
    }
  });

  return {
    status: 'healthy',
    message: 'Storage is accessible',
    latencyMs,
  };
}

export async function checkAuth(): Promise<HealthCheckServiceResult> {
  const { latencyMs } = await measure(async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }
  });

  return {
    status: 'healthy',
    message: 'Auth service is accessible',
    latencyMs,
  };
}

export async function checkQueue(): Promise<HealthCheckServiceResult> {
  const { latencyMs } = await measure(async () => {
    const prisma = new (await import('@prisma/client')).PrismaClient();
    try {
      await prisma.$queryRaw`SELECT 1`;
    } finally {
      await prisma.$disconnect();
    }
  });

  return {
    status: 'healthy',
    message: 'Queue / job system available',
    latencyMs,
  };
}

// ─── Status aggregation ──────────────────────────────────────────────

function aggregateStatus(checks: HealthCheckChecks): HealthStatus {
  const values = Object.values(checks);
  if (values.every((c) => c.status === 'healthy')) return 'healthy';
  if (values.some((c) => c.status === 'unhealthy')) return 'unhealthy';
  return 'degraded';
}

// ─── Public API ──────────────────────────────────────────────────────

export async function runHealthCheck(): Promise<HealthCheckResult> {
  const checks: HealthCheckChecks = {
    database: await checkDatabase(),
    api: await checkApi(),
    storage: await checkStorage(),
    auth: await checkAuth(),
    queue: await checkQueue(),
  };

  const version = process.env.npm_package_version || '1.0.0-rc1';

  return {
    status: aggregateStatus(checks),
    timestamp: new Date().toISOString(),
    version,
    uptime: Math.floor((Date.now() - START_TIME) / 1000),
    checks,
  };
}

// ─── CLI runner ──────────────────────────────────────────────────────

async function main(): Promise<void> {
  const result = await runHealthCheck();

  console.log(`\n  Visual ERP — Health Check`);
  console.log(`  ${'='.repeat(40)}\n`);
  console.log(`  Status:    ${result.status.toUpperCase()}`);
  console.log(`  Timestamp: ${result.timestamp}`);
  console.log(`  Version:   ${result.version}`);
  console.log(`  Uptime:    ${result.uptime}s\n`);

  console.log(`  ${'─'.repeat(40)}`);
  console.log('  Service Checks\n');

  for (const [service, check] of Object.entries(result.checks)) {
    const icon = check.status === 'healthy' ? '✓' : check.status === 'degraded' ? '⚠' : '✘';
    console.log(`    ${icon} ${service.padEnd(12)} ${check.status.padEnd(10)} ${check.latencyMs}ms  ${check.message}`);
  }

  console.log();

  if (result.status !== 'healthy') {
    process.exit(1);
  }
}

const isMainModule = process.argv[1]?.endsWith('health-check.ts') ?? false;
if (isMainModule) {
  main();
}
