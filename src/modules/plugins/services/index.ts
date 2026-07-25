import { pluginEngine, type PluginRecord, type PluginFilter, type PluginSummary } from '@/core/plugins';
import { PluginRepository, PluginSettingRepository, PluginExecutionRepository, MarketplaceRepository } from '../repository';
import type { PluginCreateInput, PluginUpdateInput } from '../schemas';

export const PluginService = {
  async list(companyId: string, filter?: PluginFilter): Promise<PluginRecord[]> {
    const plugins = await PluginRepository.findAll(companyId);
    if (!filter) return plugins;

    let result = plugins;
    if (filter.category) result = result.filter((p) => p.category === filter.category);
    if (filter.enabled !== undefined) result = result.filter((p) => p.enabled === filter.enabled);
    if (filter.search) {
      const term = filter.search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term),
      );
    }
    return result;
  },

  async getById(id: string): Promise<PluginRecord | null> {
    return PluginRepository.findById(id);
  },

  async getBySlug(slug: string): Promise<PluginRecord | null> {
    return PluginRepository.findBySlug(slug);
  },

  async create(companyId: string, input: PluginCreateInput): Promise<PluginRecord> {
    const plugin: Omit<PluginRecord, 'installedAt' | 'updatedAt'> = {
      id: `plugin-${Date.now()}`,
      companyId,
      name: input.name,
      slug: input.slug,
      version: input.version,
      author: input.author ?? null,
      description: input.description ?? null,
      category: input.category,
      manifest: input.manifest ?? null,
      enabled: input.enabled,
    };
    const created = await PluginRepository.create(plugin);
    await pluginEngine.register(created);
    return created;
  },

  async update(id: string, input: PluginUpdateInput): Promise<PluginRecord | null> {
    const existing = await PluginRepository.findById(id);
    if (!existing) return null;

    const updated = await PluginRepository.update(id, input as Partial<PluginRecord>);
    if (updated) {
      await pluginEngine.update(updated.slug, input as Partial<PluginRecord>);
    }
    return updated;
  },

  async remove(id: string): Promise<boolean> {
    const plugin = await PluginRepository.findById(id);
    if (!plugin) return false;
    await pluginEngine.unregister(plugin.slug);
    return PluginRepository.delete(id);
  },

  async toggle(id: string): Promise<PluginRecord | null> {
    const plugin = await PluginRepository.findById(id);
    if (!plugin) return null;
    const newEnabled = !plugin.enabled;
    const updated = await PluginRepository.update(id, { enabled: newEnabled } as Partial<PluginRecord>);
    if (updated) {
      if (newEnabled) {
        await pluginEngine.enable(updated.slug);
      } else {
        await pluginEngine.disable(updated.slug);
      }
    }
    return updated;
  },

  async getSummaries(companyId: string): Promise<PluginSummary[]> {
    return (await PluginRepository.findAll(companyId)).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      version: p.version,
      author: p.author,
      description: p.description,
      category: p.category,
      enabled: p.enabled,
      installedAt: p.installedAt,
    }));
  },
};

export const RegistryService = {
  async registerPlugin(companyId: string, input: PluginCreateInput): Promise<PluginRecord> {
    const plugin = await PluginService.create(companyId, input);
    await pluginEngine.register(plugin, input.manifest as unknown as Record<string, unknown> | undefined);
    return plugin;
  },

  getRegistryStats() {
    return {
      total: pluginEngine.count(),
      enabled: pluginEngine.getEnabled().length,
      registeredMenus: pluginEngine.getSummaries().length,
    };
  },
};

export const MarketplaceService = {
  async search(companyId: string, _query?: string): Promise<{ id: string; name: string; version: string; author: string; description: string; category: string; rating: number; downloads: number; installed: boolean }[]> {
    const [listings, installed] = await Promise.all([
      MarketplaceRepository.search(companyId),
      PluginRepository.findAll(companyId),
    ]);
    const installedSlugs = new Set(installed.map((p) => p.slug));
    return listings.map((l) => ({
      ...l,
      installed: installedSlugs.has(l.name.toLowerCase().replace(/\s+/g, '-')),
    }));
  },
};

export const LifecycleService = {
  async install(companyId: string, input: PluginCreateInput): Promise<PluginRecord> {
    const plugin = await PluginService.create(companyId, input);
    await pluginEngine.register(plugin);
    await pluginEngine.executeLifecycleEvent('install', plugin.slug);
    return plugin;
  },

  async enable(id: string): Promise<PluginRecord | null> {
    const updated = await PluginService.toggle(id);
    if (updated?.enabled) {
      await pluginEngine.executeLifecycleEvent('enable', updated.slug);
    }
    return updated;
  },

  async disable(id: string): Promise<PluginRecord | null> {
    const plugin = await PluginRepository.findById(id);
    if (!plugin) return null;
    await pluginEngine.executeLifecycleEvent('disable', plugin.slug);
    return PluginService.toggle(id);
  },

  async remove(id: string): Promise<boolean> {
    const plugin = await PluginRepository.findById(id);
    if (!plugin) return false;
    await pluginEngine.executeLifecycleEvent('remove', plugin.slug);
    return PluginService.remove(id);
  },
};

export const ExecutionService = {
  async list(pluginId?: string) {
    if (pluginId) {
      return PluginExecutionRepository.findByPlugin(pluginId);
    }
    return PluginExecutionRepository.findAll();
  },
};
