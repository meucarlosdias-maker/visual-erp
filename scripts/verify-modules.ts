import { existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const MODULES_DIR = join(ROOT, 'src', 'modules');

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

// Expected structure for each module
const EXPECTED_ENTRIES: { path: string; label: string }[] = [
  { path: 'types/index.ts', label: 'types/index.ts' },
  { path: 'schemas/index.ts', label: 'schemas/index.ts' },
  { path: 'validators/index.ts', label: 'validators/index.ts' },
  { path: 'repository/index.ts', label: 'repository/index.ts' },
  { path: 'services/index.ts', label: 'services/index.ts' },
  { path: 'actions/index.ts', label: 'actions/index.ts' },
  { path: 'hooks/index.ts', label: 'hooks/index.ts' },
  { path: 'index.ts', label: 'index.ts (module root)' },
];

// Components can be index.ts or index.tsx
const COMPONENT_ENTRIES = [
  { path: 'components/index.ts', label: 'components/index.ts' },
  { path: 'components/index.tsx', label: 'components/index.tsx' },
];

const KNOWN_MODULES = [
  'ai', 'analytics', 'api', 'auth', 'builder',
  'calendar', 'catalog', 'communication', 'company',
  'crm', 'dashboard', 'devops', 'equipments',
  'financial', 'installations', 'jobs', 'knowledge',
  'materials', 'platform', 'plugins', 'projects',
  'quotations', 'security', 'system', 'teams',
  'tenants', 'users', 'work-orders', 'workflows',
];

function checkModule(mod: string): void {
  const modPath = join(MODULES_DIR, mod);

  if (!existsSync(modPath)) {
    fail(`Module directory missing: ${mod}`);
    return;
  }

  // Check standard barrel files
  for (const entry of EXPECTED_ENTRIES) {
    const fullPath = join(modPath, ...entry.path.split('/'));
    if (existsSync(fullPath)) {
      ok(`${mod}: ${entry.label}`);
    } else {
      fail(`${mod}: missing ${entry.label}`);
    }
  }

  // Check components barrel (index.ts or index.tsx)
  const hasComponentBarrel = COMPONENT_ENTRIES.some((e) => {
    const fullPath = join(modPath, ...e.path.split('/'));
    return existsSync(fullPath);
  });

  if (hasComponentBarrel) {
    ok(`${mod}: components barrel exists`);
  } else {
    fail(`${mod}: missing components/index.ts or components/index.tsx`);
  }
}

function getModuleNames(): string[] {
  if (!existsSync(MODULES_DIR)) {
    return [];
  }
  return readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

const existingModules = getModuleNames();

// Check all known modules exist
for (const mod of KNOWN_MODULES) {
  if (existingModules.includes(mod)) {
    ok(`Module exists: ${mod}`);
  } else {
    fail(`Expected module not found: ${mod}`);
  }
}

// Check for unexpected modules
for (const mod of existingModules) {
  if (!KNOWN_MODULES.includes(mod)) {
    fail(`Unexpected module found: ${mod}`);
  }
}

// Structural check for each module
for (const mod of existingModules) {
  checkModule(mod);
}

const failures = checks.filter((c) => !c.pass);
const successes = checks.filter((c) => c.pass);

console.log(`\n  Visual ERP — Modules Verification`);
console.log(`  ${'='.repeat(40)}\n`);
console.log(`  Modules found: ${existingModules.length}`);
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
