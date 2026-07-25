import { z } from 'zod';

export const PluginCategoryEnum = z.enum([
  'integration',
  'analytics',
  'automation',
  'ui',
  'report',
  'other',
]);

export const PluginManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  author: z.string().default(''),
  description: z.string().default(''),
  permissions: z.array(z.string()).default([]),
  routes: z.array(z.object({
    path: z.string(),
    component: z.string(),
    label: z.string().optional(),
  })).default([]),
  menus: z.array(z.object({
    label: z.string(),
    icon: z.string().optional(),
    path: z.string().optional(),
    children: z.array(z.lazy(() => z.any())).optional(),
  })).default([]),
  events: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
});

export const PluginCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  version: z.string().default('1.0.0'),
  author: z.string().optional(),
  description: z.string().optional(),
  category: PluginCategoryEnum.default('other'),
  manifest: PluginManifestSchema.optional(),
  enabled: z.boolean().default(true),
});

export const PluginUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  version: z.string().optional(),
  author: z.string().optional(),
  description: z.string().optional(),
  category: PluginCategoryEnum.optional(),
  manifest: PluginManifestSchema.optional(),
  enabled: z.boolean().optional(),
});

export const PluginSettingCreateSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export const PluginExecutionCreateSchema = z.object({
  pluginId: z.string().min(1),
  event: z.string().min(1),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).default('pending'),
});

export type PluginCreateInput = z.infer<typeof PluginCreateSchema>;
export type PluginUpdateInput = z.infer<typeof PluginUpdateSchema>;
export type PluginSettingCreateInput = z.infer<typeof PluginSettingCreateSchema>;
export type PluginExecutionCreateInput = z.infer<typeof PluginExecutionCreateSchema>;
