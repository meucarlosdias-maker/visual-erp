export const PROJECTS_PERMISSIONS = [
  'projects.view',
  'projects.create',
  'projects.edit',
  'projects.delete',
  'production.view',
  'production.manage',
] as const;
export type ProjectsPermission = typeof PROJECTS_PERMISSIONS[number];
