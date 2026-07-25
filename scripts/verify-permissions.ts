import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const MODULES_DIR = join(ROOT, 'src', 'modules');
const CONFIG_DIR = join(ROOT, 'src', 'config');
const ROUTES_FILE = join(CONFIG_DIR, 'routes.ts');
const PERMISSIONS_FILE = join(CONFIG_DIR, 'permissions.ts');
const PERMISSIONS_DIR = join(CONFIG_DIR, 'permissions');

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

// Map module folder name → permission prefix / route prefix
const MODULE_TO_PREFIX: Record<string, string> = {
  ai: 'ai',
  analytics: 'analytics',
  api: 'api',
  auth: 'auth',
  builder: 'builder',
  calendar: 'calendar',
  catalog: 'catalog',
  communication: 'communication',
  company: 'company',
  crm: 'crm',
  dashboard: 'dashboard',
  devops: 'devops',
  equipments: 'equipments',
  financial: 'financial',
  installations: 'installations',
  jobs: 'jobs',
  knowledge: 'knowledge',
  materials: 'materials',
  platform: 'platform',
  plugins: 'plugins',
  projects: 'projects',
  quotations: 'quotations',
  security: 'security',
  system: 'system',
  teams: 'teams',
  tenants: 'tenants',
  users: 'users',
  'work-orders': 'work.orders',
  workflows: 'workflows',
};

function getModuleNames(): string[] {
  return readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

// ─── 1. Check permissions.ts / permissions/*.ts have entries for each module ──
function checkPermissionsHaveModuleEntries(): void {
  if (!existsSync(PERMISSIONS_FILE) && !existsSync(PERMISSIONS_DIR)) {
    fail('No permissions configuration found');
    return;
  }

  let permissionsContent = '';
  if (existsSync(PERMISSIONS_FILE)) {
    permissionsContent = readFileSync(PERMISSIONS_FILE, 'utf-8');
  }

  const permissionFiles: string[] = [];
  if (existsSync(PERMISSIONS_DIR)) {
    for (const entry of readdirSync(PERMISSIONS_DIR, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.ts')) {
        permissionFiles.push(entry.name.replace(/\.ts$/, ''));
      }
    }
  }

  const modules = getModuleNames();

  for (const mod of modules) {
    const prefix = MODULE_TO_PREFIX[mod] ?? mod;
    const inMainFile = permissionsContent.includes(`${prefix}.`);
    const inSplitFile = permissionFiles.includes(mod) || permissionFiles.includes(prefix);

    if (inMainFile || inSplitFile) {
      ok(`Permission entry found for module: ${mod}`);
    } else {
      fail(`No permission entry found for module: ${mod}`, `Expected "${prefix}.*" in permissions.ts or permissions/${mod}.ts`);
    }
  }
}

// ─── 2. Check routes.ts has constants for each module ──────────────────────
function checkRoutesHaveModuleConstants(): void {
  if (!existsSync(ROUTES_FILE)) {
    fail('routes.ts not found');
    return;
  }

  const routesContent = readFileSync(ROUTES_FILE, 'utf-8');
  const modules = getModuleNames();

  for (const mod of modules) {
    const upper = mod
      .replace(/-/g, '_')
      .replace(/(^\w|\_\w)/g, (m) => m.toUpperCase())
      .toUpperCase();

    const expectedKey = upper;
    const hasKey = routesContent.includes(`${expectedKey}:`) || routesContent.includes(`'${mod}'`) || routesContent.includes(`"/${mod}"`) || routesContent.includes(`/${mod}'`) || routesContent.includes(`/${mod}"`);

    if (hasKey) {
      ok(`Route constant found for module: ${mod}`);
    } else {
      fail(`No route constant found for module: ${mod}`);
    }
  }
}

// ─── 3. Verify permission naming convention (module.action) ────────────────
function checkPermissionNamingConvention(): void {
  const filesToScan: string[] = [];

  if (existsSync(PERMISSIONS_FILE)) {
    filesToScan.push(PERMISSIONS_FILE);
  }

  if (existsSync(PERMISSIONS_DIR)) {
    for (const entry of readdirSync(PERMISSIONS_DIR, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.ts')) {
        filesToScan.push(join(PERMISSIONS_DIR, entry.name));
      }
    }
  }

  // Pattern for permission strings: module.action or module:action
  const permissionRegex = /['"]([a-zA-Z][\w.]*(?:\.[a-zA-Z][\w]*|:\*|:\w+))['"]/g;

  let total = 0;
  let valid = 0;
  let invalid = 0;

  for (const file of filesToScan) {
    const content = readFileSync(file, 'utf-8');
    const matches = content.matchAll(permissionRegex);

    for (const match of matches) {
      total++;
      const perm = match[1];
      if (perm === '*') {
        valid++;
        continue;
      }

      // Valid patterns: module.action, module:action, module:*, module.*
      if (/^[a-z][a-z0-9]*(\.[a-z][a-z0-9_]*|:[a-z*][a-z0-9*]*)$/.test(perm)) {
        valid++;
      } else {
        invalid++;
        fail(`Invalid permission format: "${perm}"`, `Found in ${file}`);
      }
    }
  }

  if (total > 0 && invalid === 0) {
    ok('All permission names follow convention', `${valid} permissions checked`);
  } else if (total === 0) {
    fail('No permissions found to check');
  }
}

checkPermissionsHaveModuleEntries();
checkRoutesHaveModuleConstants();
checkPermissionNamingConvention();

const failures = checks.filter((c) => !c.pass);
const successes = checks.filter((c) => c.pass);

console.log(`\n  Visual ERP — Permissions Verification`);
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
