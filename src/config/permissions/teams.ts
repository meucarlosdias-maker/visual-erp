export const TEAMS_PERMISSIONS = [
  'teams.view',
  'teams.create',
  'teams.edit',
  'teams.delete',
] as const;

export type TeamsPermission = typeof TEAMS_PERMISSIONS[number];
