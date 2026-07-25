import type { PluginRecord, PluginManifest, PluginCapabilities } from '../types';
import { validateManifest } from '../manifest';
import { pluginRegistry } from '../registry';
import { pluginPermissionManager } from '../permissions';

export interface LoaderResult {
  success: boolean;
  plugin?: PluginRecord;
  error?: string;
}

class PluginLoader {
  async load(plugin: PluginRecord, manifestData: Record<string, unknown>): Promise<LoaderResult> {
    const manifest = validateManifest(manifestData);
    if (!manifest) {
      return { success: false, error: `Manifesto inválido para o plugin "${plugin.name}"` };
    }

    const pluginWithManifest: PluginRecord = { ...plugin, manifest };

    const capabilities = this.extractCapabilities(manifest);
    pluginRegistry.register(pluginWithManifest, capabilities);
    pluginPermissionManager.register(plugin.id, manifest.permissions);

    return { success: true, plugin: pluginWithManifest };
  }

  unload(slug: string): void {
    const entry = pluginRegistry.get(slug);
    if (entry) {
      pluginRegistry.unregister(slug);
      pluginPermissionManager.unregister(entry.plugin.id);
    }
  }

  reload(plugin: PluginRecord, manifestData: Record<string, unknown>): Promise<LoaderResult> {
    this.unload(plugin.slug);
    return this.load(plugin, manifestData);
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
}

export const pluginLoader = new PluginLoader();
