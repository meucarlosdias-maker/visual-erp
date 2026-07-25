import type {
  PluginRecord,
  PluginManifest,
  PluginLifecycleEvent,
  SystemEvent,
  PluginSummary,
  PluginFilter,
  PluginCapabilities,
} from '../types';
import { validateManifest, mergeManifest, createManifest } from '../manifest';
import { pluginRegistry } from '../registry';
import { lifecycleManager } from '../lifecycle';
import { pluginPermissionManager } from '../permissions';
import { pluginLoader } from '../loader';
import { sandboxManager } from '../sandbox';

class PluginEngine {
  private plugins = new Map<string, PluginRecord>();

  async register(plugin: PluginRecord, manifestData?: Record<string, unknown>): Promise<void> {
    let manifest: PluginManifest = createManifest({});
    if (manifestData) {
      const validated = validateManifest(manifestData);
      if (validated) {
        manifest = mergeManifest(manifest, validated);
      }
    }

    const pluginWithManifest: PluginRecord = { ...plugin, manifest };
    this.plugins.set(plugin.slug, pluginWithManifest);

    const capabilities = this.extractCapabilities(manifest);
    pluginRegistry.register(pluginWithManifest, capabilities);
    pluginPermissionManager.register(plugin.id, manifest.permissions);
    sandboxManager.createContext(plugin.id, plugin.name, plugin.version);
  }

  async unregister(slug: string): Promise<void> {
    const plugin = this.plugins.get(slug);
    if (plugin) {
      await lifecycleManager.remove(plugin);
      pluginRegistry.unregister(slug);
      pluginPermissionManager.unregister(plugin.id);
      sandboxManager.removeContext(plugin.id);
      this.plugins.delete(slug);
    }
  }

  async enable(slug: string): Promise<void> {
    const plugin = this.plugins.get(slug);
    if (!plugin) return;

    const updated: PluginRecord = { ...plugin, enabled: true };
    this.plugins.set(slug, updated);
    await lifecycleManager.enable(updated);

    if (updated.manifest) {
      const capabilities = this.extractCapabilities(updated.manifest);
      pluginRegistry.register(updated, capabilities);
    }
  }

  async disable(slug: string): Promise<void> {
    const plugin = this.plugins.get(slug);
    if (!plugin) return;

    const updated: PluginRecord = { ...plugin, enabled: false };
    this.plugins.set(slug, updated);
    await lifecycleManager.disable(updated);
    pluginRegistry.unregister(slug);
  }

  async update(slug: string, data: Partial<PluginRecord>, manifestData?: Record<string, unknown>): Promise<PluginRecord | null> {
    const existing = this.plugins.get(slug);
    if (!existing) return null;

    const previousVersion = existing.version;
    let manifest = existing.manifest;
    if (manifestData) {
      const validated = validateManifest(manifestData);
      if (validated && manifest) {
        manifest = mergeManifest(manifest, validated);
      }
    }

    const updated: PluginRecord = { ...existing, ...data, manifest };
    this.plugins.set(slug, updated);

    if (data.version && data.version !== previousVersion) {
      await lifecycleManager.update(updated, previousVersion);
    }

    if (manifest) {
      const capabilities = this.extractCapabilities(manifest);
      pluginRegistry.register(updated, capabilities);
      pluginPermissionManager.register(updated.id, manifest.permissions);
    }

    return updated;
  }

  get(slug: string): PluginRecord | undefined {
    return this.plugins.get(slug);
  }

  getAll(): PluginRecord[] {
    return Array.from(this.plugins.values());
  }

  getEnabled(): PluginRecord[] {
    return this.getAll().filter((p) => p.enabled);
  }

  getByCategory(category: string): PluginRecord[] {
    return this.getAll().filter((p) => p.category === category);
  }

  search(filter: PluginFilter): PluginRecord[] {
    let result = this.getAll();
    if (filter.category) result = result.filter((p) => p.category === filter.category);
    if (filter.enabled !== undefined) result = result.filter((p) => p.enabled === filter.enabled);
    if (filter.search) {
      const term = filter.search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term),
      );
    }
    return result;
  }

  getSummaries(): PluginSummary[] {
    return this.getAll().map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      version: p.version,
      author: p.author,
      description: p.description,
      category: p.category as PluginRecord['category'],
      enabled: p.enabled,
      installedAt: p.installedAt,
    }));
  }

  async handleSystemEvent(event: SystemEvent, data?: unknown): Promise<void> {
    const plugins = this.getEnabled();
    for (const plugin of plugins) {
      if (plugin.manifest?.events.includes(event)) {
        sandboxManager.getContext(plugin.id)?.api.emit(event, data);
      }
    }
  }

  async executeLifecycleEvent(event: PluginLifecycleEvent, slug: string): Promise<void> {
    const plugin = this.plugins.get(slug);
    if (!plugin) return;
    await lifecycleManager.execute(event, plugin);
  }

  private extractCapabilities(manifest: PluginManifest): PluginCapabilities {
    return {
      menus: manifest.menus,
      routes: manifest.routes,
      components: [],
      permissions: manifest.permissions,
      events: manifest.events,
      hooks: manifest.events.map((e) => `on${e}`),
    };
  }

  clear(): void {
    this.plugins.clear();
    pluginRegistry.clear();
    pluginPermissionManager.clear();
    sandboxManager.clear();
  }

  count(): number {
    return this.plugins.size;
  }
}

export const pluginEngine = new PluginEngine();
