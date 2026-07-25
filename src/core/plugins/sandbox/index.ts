import type { SandboxAPI, PluginContext } from '../types';

const RESTRICTED_GLOBALS = [
  'process',
  'require',
  'module',
  '__dirname',
  '__filename',
  'global',
  'eval',
  'Function',
  'setTimeout',
  'setInterval',
  'setImmediate',
];

class SandboxManager {
  private contexts = new Map<string, PluginContext>();

  createContext(pluginId: string, pluginName: string, pluginVersion: string, services: Record<string, unknown> = {}): PluginContext {
    const sandboxStore = new Map<string, string>();

    const api: SandboxAPI = {
      fetch: async (url: string, options?: RequestInit) => {
        return fetch(url, options);
      },
      localStorage: {
        getItem: (key: string) => sandboxStore.get(key) ?? null,
        setItem: (key: string, value: string) => { sandboxStore.set(key, value); },
        removeItem: (key: string) => { sandboxStore.delete(key); },
      },
      plugin: {
        getId: () => pluginId,
        getName: () => pluginName,
        getVersion: () => pluginVersion,
        getSetting: (key: string) => this.settings.get(`${pluginId}:${key}`),
        setSetting: (key: string, value: string) => { this.settings.set(`${pluginId}:${key}`, value); },
      },
      services,
      emit: (event: string, data?: unknown) => {
        const handlers = this.eventHandlers.get(event) ?? [];
        handlers.forEach((h) => h(data));
      },
      on: (event: string, handler: (data?: unknown) => void) => {
        const handlers = this.eventHandlers.get(event) ?? [];
        handlers.push(handler);
        this.eventHandlers.set(event, handlers);
      },
    };

    const context: PluginContext = { pluginId, pluginName, pluginVersion, api };
    this.contexts.set(pluginId, context);
    return context;
  }

  private settings = new Map<string, string>();
  private eventHandlers = new Map<string, Array<(data?: unknown) => void>>();

  getContext(pluginId: string): PluginContext | undefined {
    return this.contexts.get(pluginId);
  }

  removeContext(pluginId: string): void {
    this.contexts.delete(pluginId);
  }

  getRestrictedGlobals(): string[] {
    return [...RESTRICTED_GLOBALS];
  }

  validateAccess(key: string): boolean {
    if (RESTRICTED_GLOBALS.includes(key)) return false;
    if (key.startsWith('process.')) return false;
    return true;
  }

  clear(): void {
    this.contexts.clear();
    this.settings.clear();
    this.eventHandlers.clear();
  }
}

export const sandboxManager = new SandboxManager();
