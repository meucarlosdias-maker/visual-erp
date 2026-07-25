import type { PluginCategory } from '@/core/plugins';

export interface PluginFormData {
  name: string;
  slug: string;
  version: string;
  author: string;
  description: string;
  category: PluginCategory;
  enabled: boolean;
}

export interface PluginSearchForm {
  search?: string;
  category?: PluginCategory | '';
  enabled?: boolean | '';
}

export interface MarketplaceListingData {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: PluginCategory;
  rating: number;
  downloads: number;
  installed: boolean;
}

export interface PluginExecutionFilter {
  pluginId?: string;
  event?: string;
  status?: string;
}
