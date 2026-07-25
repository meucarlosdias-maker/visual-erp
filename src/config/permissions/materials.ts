export const MATERIALS_PERMISSIONS = [
  'materials.view',
  'materials.create',
  'materials.edit',
  'materials.delete',
] as const;

export type MaterialsPermission = typeof MATERIALS_PERMISSIONS[number];
