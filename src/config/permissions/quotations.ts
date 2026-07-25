export const QUOTATIONS_PERMISSIONS = [
  'quotations.view',
  'quotations.create',
  'quotations.edit',
  'quotations.delete',
  'quotations.approve',
  'quotations.export',
] as const;
export type QuotationsPermission = typeof QUOTATIONS_PERMISSIONS[number];
