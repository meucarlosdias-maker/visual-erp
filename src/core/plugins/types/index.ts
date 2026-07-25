export type PluginStatus = 'installed' | 'enabled' | 'disabled' | 'error';

export type PluginCategory = 'integration' | 'analytics' | 'automation' | 'ui' | 'report' | 'other';

export type PluginLifecycleEvent = 'install' | 'enable' | 'disable' | 'update' | 'remove';

export type SystemEvent =
  | 'ApplicationStarted'
  | 'UserLoggedIn'
  | 'LeadCreated'
  | 'QuoteApproved'
  | 'ProjectCreated'
  | 'ProductionFinished'
  | 'InstallationFinished'
  | 'FinancialReceived';

export interface PluginManifest {
  name: string;
  version: string;
  author: string;
  description: string;
  permissions: string[];
  routes: PluginManifestRoute[];
  menus: PluginManifestMenu[];
  events: string[];
  dependencies: string[];
}

export interface PluginManifestRoute {
  path: string;
  component: string;
  label?: string;
}

export interface PluginManifestMenu {
  label: string;
  icon?: string;
  path?: string;
  children?: PluginManifestMenu[];
}

export interface PluginRecord {
  id: string;
  companyId: string;
  name: string;
  slug: string;
  version: string;
  author: string | null;
  description: string | null;
  category: PluginCategory;
  manifest: PluginManifest | null;
  enabled: boolean;
  installedAt: Date;
  updatedAt: Date;
}

export interface PluginSettingRecord {
  id: string;
  pluginId: string;
  key: string;
  value: string;
}

export interface PluginPermissionRecord {
  id: string;
  pluginId: string;
  permission: string;
}

export interface PluginExecutionRecord {
  id: string;
  pluginId: string;
  event: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  duration: number | null;
  error: string | null;
  createdAt: Date;
}

export interface PluginCapabilities {
  menus: PluginManifestMenu[];
  routes: PluginManifestRoute[];
  components: string[];
  permissions: string[];
  events: string[];
  hooks: string[];
}

export interface PluginRegistryEntry {
  plugin: PluginRecord;
  capabilities: PluginCapabilities;
}

export interface RegistryEntry<T> {
  id: string;
  pluginId: string;
  item: T;
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: PluginCategory;
  rating: number;
  downloads: number;
  screenshots: string[];
  createdAt: Date;
}

export interface SandboxAPI {
  fetch(url: string, options?: RequestInit): Promise<Response>;
  localStorage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };
  plugin: {
    getId(): string;
    getName(): string;
    getVersion(): string;
    getSetting(key: string): string | undefined;
    setSetting(key: string, value: string): void;
  };
  services: Record<string, unknown>;
  emit(event: string, data?: unknown): void;
  on(event: string, handler: (data?: unknown) => void): void;
}

export interface PluginContext {
  pluginId: string;
  pluginName: string;
  pluginVersion: string;
  api: SandboxAPI;
}

export interface PluginAPI {
  getContext(): PluginContext;
  registerHook(name: string, handler: (...args: unknown[]) => unknown): void;
  registerEventHandler(event: string, handler: (data?: unknown) => void): void;
  getSetting(key: string): string | undefined;
  setSetting(key: string, value: string): void;
  emit(event: string, data?: unknown): void;
}

export interface PluginHooks {
  register(name: string, handler: (...args: unknown[]) => unknown): void;
  unregister(name: string): void;
  execute(name: string, ...args: unknown[]): unknown[];
}

export interface PluginEvents {
  on(event: string, handler: (data?: unknown) => void): void;
  off(event: string, handler: (data?: unknown) => void): void;
  emit(event: string, data?: unknown): void;
}

export type PluginSummary = {
  id: string;
  name: string;
  slug: string;
  version: string;
  author: string | null;
  description: string | null;
  category: PluginCategory;
  enabled: boolean;
  installedAt: Date;
};

export type PluginFilter = {
  category?: PluginCategory;
  enabled?: boolean;
  search?: string;
};
