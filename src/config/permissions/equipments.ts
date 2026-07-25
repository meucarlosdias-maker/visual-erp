export const EQUIPMENTS_PERMISSIONS = [
  'equipments.view',
  'equipments.create',
  'equipments.edit',
  'equipments.delete',
] as const;

export type EquipmentsPermission = typeof EQUIPMENTS_PERMISSIONS[number];
