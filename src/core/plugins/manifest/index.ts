import type { PluginManifest } from '../types';

export function validateManifest(data: Record<string, unknown>): PluginManifest | null {
  if (!data || typeof data !== 'object') return null;
  if (typeof data.name !== 'string' || !data.name) return null;
  if (typeof data.version !== 'string' || !data.version) return null;

  return {
    name: data.name as string,
    version: data.version as string,
    author: (data.author as string) ?? '',
    description: (data.description as string) ?? '',
    permissions: Array.isArray(data.permissions) ? (data.permissions as string[]) : [],
    routes: Array.isArray(data.routes) ? (data.routes as PluginManifest['routes']) : [],
    menus: Array.isArray(data.menus) ? (data.menus as PluginManifest['menus']) : [],
    events: Array.isArray(data.events) ? (data.events as string[]) : [],
    dependencies: Array.isArray(data.dependencies) ? (data.dependencies as string[]) : [],
  };
}

export function createManifest(data: Partial<PluginManifest>): PluginManifest {
  return {
    name: data.name ?? '',
    version: data.version ?? '1.0.0',
    author: data.author ?? '',
    description: data.description ?? '',
    permissions: data.permissions ?? [],
    routes: data.routes ?? [],
    menus: data.menus ?? [],
    events: data.events ?? [],
    dependencies: data.dependencies ?? [],
  };
}

export function mergeManifest(base: PluginManifest, override: Partial<PluginManifest>): PluginManifest {
  return {
    ...base,
    ...override,
    permissions: [...new Set([...base.permissions, ...(override.permissions ?? [])])],
    routes: [...base.routes, ...(override.routes ?? [])],
    menus: [...base.menus, ...(override.menus ?? [])],
    events: [...new Set([...base.events, ...(override.events ?? [])])],
    dependencies: [...new Set([...base.dependencies, ...(override.dependencies ?? [])])],
  };
}

export { type PluginManifest };
