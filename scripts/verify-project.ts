import { existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

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

// ─── Required directories ───────────────────────────────────────────
const REQUIRED_DIRS = [
  'src/app',
  'src/modules',
  'src/core',
  'src/components',
  'src/config',
  'prisma',
  'tests',
  'public',
];

// ─── Key files ──────────────────────────────────────────────────────
const KEY_FILES = [
  'package.json',
  'tsconfig.json',
  'next.config.ts',
  'vitest.config.ts',
  'eslint.config.mjs',
  '.env.example',
];

// ─── Module barrel files ────────────────────────────────────────────
const BARREL_FILES = [
  'types/index.ts',
  'schemas/index.ts',
  'validators/index.ts',
  'repository/index.ts',
  'services/index.ts',
  'actions/index.ts',
  'hooks/index.ts',
  'components/index.ts',
  'components/index.tsx',
  'index.ts',
];

function checkDirectories(): void {
  for (const dir of REQUIRED_DIRS) {
    const fullPath = join(ROOT, dir);
    try {
      if (statSync(fullPath).isDirectory()) {
        ok(`Directory exists: ${dir}`);
      } else {
        fail(`Not a directory: ${dir}`);
      }
    } catch {
      fail(`Missing directory: ${dir}`);
    }
  }
}

function checkKeyFiles(): void {
  for (const file of KEY_FILES) {
    const fullPath = join(ROOT, file);
    if (existsSync(fullPath)) {
      ok(`File exists: ${file}`);
    } else {
      fail(`Missing file: ${file}`);
    }
  }
}

function checkModuleBarrels(): void {
  const modulesDir = join(ROOT, 'src', 'modules');
  if (!existsSync(modulesDir)) {
    fail('src/modules directory not found — skipping barrel checks');
    return;
  }
  const moduleNames = readdirSync(modulesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const mod of moduleNames) {
    const modPath = join(modulesDir, mod);
    for (const barrel of BARREL_FILES) {
      const barrelPath = join(modPath, ...barrel.split('/'));
      const label = `${mod}/${barrel}`;
      if (existsSync(barrelPath)) {
        ok(`Barrel exists: ${label}`);
      } else {
        fail(`Missing barrel: ${label}`);
      }
    }
  }
}

checkDirectories();
checkKeyFiles();
checkModuleBarrels();

// ─── Report ─────────────────────────────────────────────────────────
const failures = checks.filter((c) => !c.pass);
const successes = checks.filter((c) => c.pass);

console.log(`\n  Visual ERP — Project Health Check`);
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
