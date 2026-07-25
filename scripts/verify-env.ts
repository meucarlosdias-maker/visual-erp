import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { parse } from 'dotenv';

const ROOT = resolve(import.meta.dirname, '..');

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

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'APP_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const;

const ENV_FILES = [
  '.env',
  '.env.development',
  '.env.production',
  '.env.staging',
] as const;

// Parse a .env file and return the variable names
function parseEnvFile(filePath: string): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const parsed = parse(content);
    return Object.keys(parsed);
  } catch {
    return [];
  }
}

// ─── 1. Check .env.example exists and has required vars ───────────────
function checkEnvExample(): void {
  const examplePath = join(ROOT, '.env.example');

  if (!existsSync(examplePath)) {
    fail('.env.example file missing');
    return;
  }

  const keys = parseEnvFile(examplePath);

  for (const required of REQUIRED_VARS) {
    if (keys.includes(required)) {
      ok(`Required variable in .env.example: ${required}`);
    } else {
      fail(`Required variable missing from .env.example: ${required}`);
    }
  }
}

// ─── 2. Check env files exist ──────────────────────────────────────
function checkEnvFilesExist(): void {
  for (const file of ENV_FILES) {
    const fullPath = join(ROOT, file);
    if (existsSync(fullPath)) {
      ok(`Environment file exists: ${file}`);
    } else {
      fail(`Environment file missing: ${file}`);
    }
  }
}

// ─── 3. Compare keys across env files ────────────────────────────────
function compareEnvKeys(): void {
  const files = ENV_FILES.filter((f) => existsSync(join(ROOT, f)));
  const exampleFile = join(ROOT, '.env.example');
  if (existsSync(exampleFile)) {
    // Include .env.example in comparison if any env files exist
    if (files.length > 0 && !files.includes('.env.example')) {
      (files as string[]).unshift('.env.example');
    }
  }

  if (files.length < 2) {
    fail('Not enough environment files to compare');
    return;
  }

  // Build a map of file → set of keys
  const fileKeys: Record<string, Set<string>> = {};
  for (const file of files) {
    const fullPath = join(ROOT, file);
    fileKeys[file] = new Set(parseEnvFile(fullPath));
  }

  // First file is the reference
  const refFile = files[0];
  const refKeys = fileKeys[refFile];

  for (const file of files.slice(1)) {
    const keys = fileKeys[file];

    // Variables in reference but not in this file
    for (const key of refKeys) {
      if (!keys.has(key)) {
        fail(`Missing variable in ${file}: ${key}`, `Present in ${refFile}`);
      }
    }

    // Variables in this file but not in reference
    for (const key of keys) {
      if (!refKeys.has(key)) {
        fail(`Extra variable in ${file}: ${key}`, `Not in ${refFile}`);
      }
    }
  }

  ok('Environment files cross-compared', `${files.length} files compared`);
}

// ─── 4. Report total variable counts ─────────────────────────────────
function reportEnvStats(): void {
  const allFiles = ['.env.example', ...ENV_FILES];
  for (const file of allFiles) {
    const fullPath = join(ROOT, file);
    if (existsSync(fullPath)) {
      const keys = parseEnvFile(fullPath);
      ok(`Environment stats: ${file} has ${keys.length} variables`);
    }
  }
}

checkEnvExample();
checkEnvFilesExist();
compareEnvKeys();
reportEnvStats();

const failures = checks.filter((c) => !c.pass);
const successes = checks.filter((c) => c.pass);

console.log(`\n  Visual ERP — Environment Verification`);
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
