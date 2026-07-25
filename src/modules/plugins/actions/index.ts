'use client';

import type { PluginRecord, PluginLifecycleEvent } from '@/core/plugins';
import { LifecycleService, PluginService } from '../services';

export async function installPlugin(companyId: string, name: string, slug: string): Promise<PluginRecord> {
  return LifecycleService.install(companyId, {
    name,
    slug,
    version: '1.0.0',
    author: 'Visual ERP',
    description: '',
    category: 'other',
    enabled: true,
  });
}

export async function uninstallPlugin(id: string): Promise<boolean> {
  return LifecycleService.remove(id);
}

export async function enablePlugin(id: string): Promise<PluginRecord | null> {
  return LifecycleService.enable(id);
}

export async function disablePlugin(id: string): Promise<PluginRecord | null> {
  return LifecycleService.disable(id);
}

export async function executeLifecycleAction(id: string, event: PluginLifecycleEvent): Promise<void> {
  const { pluginEngine } = await import('@/core/plugins');
  const plugin = await PluginService.getById(id);
  if (plugin) {
    await pluginEngine.executeLifecycleEvent(event, plugin.slug);
  }
}
