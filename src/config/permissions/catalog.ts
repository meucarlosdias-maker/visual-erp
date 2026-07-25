export const CATALOG_PERMISSIONS = [
  'catalog.view',
  'catalog.create',
  'catalog.edit',
  'catalog.delete',
] as const;

export type CatalogPermission = typeof CATALOG_PERMISSIONS[number];
