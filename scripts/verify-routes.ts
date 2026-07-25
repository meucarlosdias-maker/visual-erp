import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const APP_DIR = join(ROOT, 'src', 'app', 'app');
const CONFIG_DIR = join(ROOT, 'src', 'config');
const ROUTES_FILE = join(CONFIG_DIR, 'routes.ts');

interface Check {
  label: string;
  pass: boolean;
  details?: string;
}

const checks: Check[] = [];

function ok(label: string, details?: string): void {
  checks.push({ label, pass: true, details });
}

function fail(label: string, details?: string): void {
  checks.push({ label, pass: false, details });
}

function getRouteDirs(): string[] {
  if (!existsSync(APP_DIR)) {
    return [];
  }
  return readdirSync(APP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

// ─── 1. Check all route directories exist ──────────────────────────────
function checkRouteDirectories(): void {
  const routeDirs = getRouteDirs();

  if (routeDirs.length === 0) {
    fail('No route directories found under src/app/app/');
    return;
  }

  for (const dir of routeDirs) {
    ok(`Route directory exists: /app/${dir}`);
  }
}

// ─── 2. Parse routes.ts and verify they match filesystem ──────────────
function checkRoutesMatchFilesystem(): void {
  if (!existsSync(ROUTES_FILE)) {
    fail('routes.ts not found');
    return;
  }

  const routeDirs = getRouteDirs();
  const content = readFileSync(ROUTES_FILE, 'utf-8');

  // Extract all route path strings from routes.ts
  const routePaths = new Set<string>();

  const simpleRouteRegex = /['"](?:\/app\/([a-z][a-z0-9_-]+))['"]/gi;
  for (const m of content.matchAll(simpleRouteRegex)) {
    routePaths.add(m[1]);
  }

  // Also check for template literal routes like `/app/${something}`
  const templateRegex = /\/app\/(\$\{[^}]+\}|[a-z][a-z0-9_-]+)/gi;
  for (const m of content.matchAll(templateRegex)) {
    if (!m[1].startsWith('$')) {
      routePaths.add(m[1]);
    }
  }

  // Check every route dir is referenced in routes.ts
  for (const dir of routeDirs) {
    const referenced = Array.from(routePaths).some((p) => p === dir || p.startsWith(`${dir}/`));
    if (referenced) {
      ok(`Route /app/${dir} is defined in routes.ts`);
    } else {
      fail(`Route /app/${dir} is missing from routes.ts`);
    }
  }

  // Check every route path in routes.ts has a corresponding directory
  for (const path of routePaths) {
    const dirName = path.split('/')[0];
    if (routeDirs.includes(dirName)) {
      ok(`routes.ts entry "/app/${path}" has matching directory`);
    } else {
      fail(`routes.ts entry "/app/${path}" has no directory in src/app/app/`);
    }
  }
}

checkRouteDirectories();
checkRoutesMatchFilesystem();

const failures = checks.filter((c) => !c.pass);
const successes = checks.filter((c) => c.pass);

console.log(`\n  Visual ERP — Routes Verification`);
console.log(`  ${'='.repeat(40)}\n`);
console.log(`  Checks: ${checks.length} total, ${successes.length} passed, ${failures.length} failed\n`);

if (failures.length > 0) {
  console.log(`  ${'─'.repeat(40)}`);
  console.log('  FAILURES\n');
  for (const f of failures) {
    console.log(`    ✘  ${f.label}${f.details ? ` — ${f.details}` : ''}`);
  }
  console.log();
}

process.exit(failures.length > 0 ? 1 : 0);
