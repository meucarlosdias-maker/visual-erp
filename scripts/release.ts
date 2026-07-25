import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const PACKAGE_JSON = join(ROOT, 'package.json');
const CHANGELOG = join(ROOT, 'CHANGELOG.md');
const SYSTEM_CONFIG = join(ROOT, 'src', 'config', 'system.ts');

interface PackageJson {
  version: string;
  [key: string]: unknown;
}

function readJson(path: string): PackageJson {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJson(path: string, data: PackageJson): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function getCurrentVersion(): string {
  return readJson(PACKAGE_JSON).version;
}

function bumpVersion(current: string, type: 'major' | 'minor' | 'patch'): string {
  const parts = current.split('.').map(Number);
  if (type === 'major') return `${parts[0] + 1}.0.0`;
  if (type === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function updatePackageVersion(version: string): void {
  const pkg = readJson(PACKAGE_JSON);
  pkg.version = version;
  writeJson(PACKAGE_JSON, pkg);
  console.log(`  ✓ package.json → ${version}`);
}

function updateSystemConfig(version: string): void {
  if (!existsSync(SYSTEM_CONFIG)) {
    console.log(`  ⚠ ${SYSTEM_CONFIG} not found, skipping`);
    return;
  }
  const content = readFileSync(SYSTEM_CONFIG, 'utf-8');
  const updated = content.replace(
    /version:\s*'[^']+'/,
    `version: '${version}'`
  );
  writeFileSync(SYSTEM_CONFIG, updated);
  console.log(`  ✓ src/config/system.ts → ${version}`);
}

function validateChangelog(version: string): void {
  if (!existsSync(CHANGELOG)) {
    console.log(`  ⚠ CHANGELOG.md not found — create it manually`);
    return;
  }
  const content = readFileSync(CHANGELOG, 'utf-8');
  if (!content.includes(`## [${version}]`)) {
    console.log(`  ⚠ CHANGELOG.md missing entry for [${version}]`);
  } else {
    console.log(`  ✓ CHANGELOG.md has entry for [${version}]`);
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const type = (args[0] as 'major' | 'minor' | 'patch' | undefined) ?? 'patch';

  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error(`  ✘ Invalid bump type: "${type}". Use: major | minor | patch`);
    process.exit(1);
  }

  const current = getCurrentVersion();
  const next = bumpVersion(current, type);

  console.log(`\n  Visual ERP — Release Script`);
  console.log(`  ${'='.repeat(35)}\n`);
  console.log(`  Current: ${current}`);
  console.log(`  Next:    ${next}`);
  console.log(`  Type:    ${type}\n`);

  updatePackageVersion(next);
  updateSystemConfig(next);
  validateChangelog(next);

  console.log(`\n  ${'='.repeat(35)}`);
  console.log(`  Release v${next} prepared.\n`);
  console.log(`  Next steps:`);
  console.log(`    1. Review CHANGELOG.md`);
  console.log(`    2. Commit: git add -A && git commit -m "chore: release v${next}"`);
  console.log(`    3. Tag:    git tag v${next}`);
  console.log(`    4. Push:   git push && git push --tags\n`);
}

main();
