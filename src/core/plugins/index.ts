export { pluginEngine } from './engine';
export { pluginRegistry } from './registry';
export { lifecycleManager } from './lifecycle';
export { pluginPermissionManager } from './permissions';
export { sandboxManager } from './sandbox';
export { pluginLoader } from './loader';
export { validateManifest, createManifest, mergeManifest } from './manifest';

export type {
  PluginStatus,
  PluginCategory,
  PluginLifecycleEvent,
  SystemEvent,
  PluginManifest,
  PluginManifestRoute,
  PluginManifestMenu,
  PluginRecord,
  PluginSettingRecord,
  PluginPermissionRecord,
  PluginExecutionRecord,
  PluginCapabilities,
  PluginRegistryEntry,
  RegistryEntry,
  MarketplacePlugin,
  SandboxAPI,
  PluginContext,
  PluginAPI,
  PluginHooks,
  PluginEvents,
  PluginSummary,
  PluginFilter,
} from './types';
