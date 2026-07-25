import type { PluginLifecycleEvent, PluginRecord } from '../types';

export interface LifecycleHook {
  onInstall?(plugin: PluginRecord): Promise<void>;
  onEnable?(plugin: PluginRecord): Promise<void>;
  onDisable?(plugin: PluginRecord): Promise<void>;
  onUpdate?(plugin: PluginRecord, previousVersion: string): Promise<void>;
  onRemove?(plugin: PluginRecord): Promise<void>;
}

class LifecycleManager {
  private hooks: LifecycleHook[] = [];

  registerHook(hook: LifecycleHook): void {
    this.hooks.push(hook);
  }

  unregisterHook(hook: LifecycleHook): void {
    this.hooks = this.hooks.filter((h) => h !== hook);
  }

  async execute(event: PluginLifecycleEvent, plugin: PluginRecord, previousVersion?: string): Promise<void> {
    for (const hook of this.hooks) {
      switch (event) {
        case 'install':
          await hook.onInstall?.(plugin);
          break;
        case 'enable':
          await hook.onEnable?.(plugin);
          break;
        case 'disable':
          await hook.onDisable?.(plugin);
          break;
        case 'update':
          if (previousVersion) {
            await hook.onUpdate?.(plugin, previousVersion);
          }
          break;
        case 'remove':
          await hook.onRemove?.(plugin);
          break;
      }
    }
  }

  async install(plugin: PluginRecord): Promise<void> {
    await this.execute('install', plugin);
  }

  async enable(plugin: PluginRecord): Promise<void> {
    await this.execute('enable', plugin);
  }

  async disable(plugin: PluginRecord): Promise<void> {
    await this.execute('disable', plugin);
  }

  async update(plugin: PluginRecord, previousVersion: string): Promise<void> {
    await this.execute('update', plugin, previousVersion);
  }

  async remove(plugin: PluginRecord): Promise<void> {
    await this.execute('remove', plugin);
  }
}

export const lifecycleManager = new LifecycleManager();
