import type {
  PluginManifestMenu,
  PluginManifestRoute,
  PluginCapabilities,
  PluginRegistryEntry,
  PluginRecord,
} from '../types';

class PluginRegistry {
  private entries = new Map<string, PluginRegistryEntry>();
  private menus = new Map<string, PluginManifestMenu[]>();
  private routes = new Map<string, PluginManifestRoute[]>();
  private components = new Map<string, string[]>();
  private permissionsSet = new Map<string, string[]>();
  private events = new Map<string, string[]>();
  private hooks = new Map<string, string[]>();

  register(plugin: PluginRecord, capabilities: PluginCapabilities): void {
    const entry: PluginRegistryEntry = { plugin, capabilities };
    this.entries.set(plugin.slug, entry);
    this.menus.set(plugin.slug, capabilities.menus);
    this.routes.set(plugin.slug, capabilities.routes);
    this.components.set(plugin.slug, capabilities.components);
    this.permissionsSet.set(plugin.slug, capabilities.permissions);
    this.events.set(plugin.slug, capabilities.events);
    this.hooks.set(plugin.slug, capabilities.hooks);
  }

  unregister(slug: string): void {
    this.entries.delete(slug);
    this.menus.delete(slug);
    this.routes.delete(slug);
    this.components.delete(slug);
    this.permissionsSet.delete(slug);
    this.events.delete(slug);
    this.hooks.delete(slug);
  }

  get(slug: string): PluginRegistryEntry | undefined {
    return this.entries.get(slug);
  }

  getAll(): PluginRegistryEntry[] {
    return Array.from(this.entries.values());
  }

  getAllMenus(): PluginManifestMenu[] {
    return Array.from(this.menus.values()).flat();
  }

  getAllRoutes(): PluginManifestRoute[] {
    return Array.from(this.routes.values()).flat();
  }

  getActivePlugins(): PluginRegistryEntry[] {
    return this.getAll().filter((e) => e.plugin.enabled);
  }

  getByCapability(capability: keyof PluginCapabilities): PluginRegistryEntry[] {
    return this.getAll().filter((e) => {
      const items = e.capabilities[capability];
      return Array.isArray(items) && items.length > 0;
    });
  }

  hasPlugin(slug: string): boolean {
    return this.entries.has(slug);
  }

  getPermissions(slug: string): string[] {
    return this.permissionsSet.get(slug) ?? [];
  }

  getEvents(slug: string): string[] {
    return this.events.get(slug) ?? [];
  }

  getHooks(slug: string): string[] {
    return this.hooks.get(slug) ?? [];
  }

  clear(): void {
    this.entries.clear();
    this.menus.clear();
    this.routes.clear();
    this.components.clear();
    this.permissionsSet.clear();
    this.events.clear();
    this.hooks.clear();
  }

  count(): number {
    return this.entries.size;
  }
}

export const pluginRegistry = new PluginRegistry();
