import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const MODULES_DIR = join(ROOT, 'src', 'modules');
const CORE_DIR = join(ROOT, 'src', 'core');

interface ModuleInfo {
  name: string;
  path: string;
  files: string[];
  components: string[];
  hooks: string[];
  services: string[];
  actions: string[];
  types: string[];
  schemas: string[];
  validators: string[];
  repositories: string[];
}

function getTsFiles(dir: string, _basePath: string): string[] {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(join(dir, entry.name));
      }
    }
    return files;
  } catch {
    return [];
  }
}

function collectModuleInfo(modPath: string, modName: string): ModuleInfo {
  const info: ModuleInfo = {
    name: modName,
    path: modPath,
    files: [],
    components: [],
    hooks: [],
    services: [],
    actions: [],
    types: [],
    schemas: [],
    validators: [],
    repositories: [],
  };

  // Recursively collect all .ts/.tsx files
  function walk(dir: string): void {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          walk(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) && entry.name !== 'index.ts') {
          info.files.push(fullPath);
        }
      }
    } catch {
      // skip inaccessible dirs
    }
  }

  walk(modPath);

  // Categorize by subdirectory
  const subdirs = ['components', 'hooks', 'services', 'actions', 'types', 'schemas', 'validators', 'repository'];
  for (const sub of subdirs) {
    const subPath = join(modPath, sub);
    const tsFiles = getTsFiles(subPath, modPath);
    switch (sub) {
      case 'components':
        info.components = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'hooks':
        info.hooks = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'services':
        info.services = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'actions':
        info.actions = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'types':
        info.types = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'schemas':
        info.schemas = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'validators':
        info.validators = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
      case 'repository':
        info.repositories = tsFiles.map((f) => f.replace(modPath + '\\', ''));
        break;
    }
  }

  return info;
}

function collectCoreInfo(corePath: string, coreName: string): { name: string; files: string[] } {
  const files: string[] = [];

  function walk(dir: string): void {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          walk(fullPath);
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    } catch {
      // skip
    }
  }

  walk(corePath);

  return { name: coreName, files: files.map((f) => f.replace(corePath + '\\', '')) };
}

function printDivider(char: string = '─'): void {
  console.log(char.repeat(72));
}

function printHeader(text: string): void {
  console.log(`\n# ${text}\n`);
}

function printModuleTable(modules: ModuleInfo[]): void {
  console.log('| Module | Files | Components | Hooks | Services | Actions | Has Index |');
  console.log('|--------|-------|------------|-------|----------|---------|-----------|');

  for (const mod of modules) {
    const hasIndex = statSync(join(mod.path, 'index.ts')).isFile() ? '✓' : '✗';
    console.log(
      `| ${mod.name} | ${mod.files.length} | ${mod.components.length} | ${mod.hooks.length} | ${mod.services.length} | ${mod.actions.length} | ${hasIndex} |`
    );
  }
}

function printModuleDetail(mod: ModuleInfo): void {
  printDivider();
  console.log(`## ${mod.name}\n`);
  console.log(`**Path:** \`${mod.path.replace(ROOT + '\\', '')}\``);
  console.log(`**Total files:** ${mod.files.length + 1} (including index.ts)\n`);

  const sections: [string, string[]][] = [
    ['Types', mod.types],
    ['Schemas', mod.schemas],
    ['Validators', mod.validators],
    ['Repository', mod.repositories],
    ['Services', mod.services],
    ['Actions', mod.actions],
    ['Hooks', mod.hooks],
    ['Components', mod.components],
  ];

  for (const [label, items] of sections) {
    if (items.length > 0) {
      console.log(`### ${label}\n`);
      for (const item of items) {
        console.log(`- \`${item}\``);
      }
      console.log();
    }
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────

const moduleNames = readdirSync(MODULES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const modules: ModuleInfo[] = [];

for (const name of moduleNames) {
  const modPath = join(MODULES_DIR, name);
  modules.push(collectModuleInfo(modPath, name));
}

// Collect core modules
const coreNames = readdirSync(CORE_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const coreModules: { name: string; files: string[] }[] = [];
for (const name of coreNames) {
  const corePath = join(CORE_DIR, name);
  coreModules.push(collectCoreInfo(corePath, name));
}

// ─── OUTPUT ──────────────────────────────────────────────────────────

console.log('# Visual ERP — Documentation Overview\n');
console.log(`Generated: ${new Date().toISOString()}\n`);

// ── Module Overview ──
printHeader('Modules Overview');
printModuleTable(modules);

// ── Module Details ──
printHeader('Module Details');
for (const mod of modules) {
  printModuleDetail(mod);
}

// ── Core Modules ──
printHeader('Core Modules');
printDivider();
for (const core of coreModules) {
  console.log(`\n## ${core.name}\n`);
  console.log(`**Path:** \`src/core/${core.name}/\``);
  console.log(`**Files:** ${core.files.length}\n`);
  for (const file of core.files) {
    console.log(`- \`${file}\``);
  }
  console.log();
}

// ── Summary Statistics ──
printHeader('Summary Statistics');
const totalModuleFiles = modules.reduce((acc, m) => acc + m.files.length, 0);
const totalCoreFiles = coreModules.reduce((acc, c) => acc + c.files.length, 0);
const totalComponents = modules.reduce((acc, m) => acc + m.components.length, 0);
const totalHooks = modules.reduce((acc, m) => acc + m.hooks.length, 0);
const totalServices = modules.reduce((acc, m) => acc + m.services.length, 0);

console.log(`- **Modules:** ${modules.length}`);
console.log(`- **Core modules:** ${coreModules.length}`);
console.log(`- **Total module files:** ${totalModuleFiles}`);
console.log(`- **Total core files:** ${totalCoreFiles}`);
console.log(`- **Components:** ${totalComponents}`);
console.log(`- **Hooks:** ${totalHooks}`);
console.log(`- **Services:** ${totalServices}`);

const grandTotal = totalModuleFiles + totalCoreFiles;
console.log(`- **Grand total files:** ${grandTotal}`);
console.log();

process.exit(0);
