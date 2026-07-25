export const Permissions = {
  COMPANY_VIEW: 'company.view',
  COMPANY_CREATE: 'company.create',
  COMPANY_UPDATE: 'company.update',
  COMPANY_DELETE: 'company.delete',

  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',

  CLIENT_VIEW: 'client.view',
  CLIENT_CREATE: 'client.create',
  CLIENT_UPDATE: 'client.update',
  CLIENT_DELETE: 'client.delete',

  PROJECT_VIEW: 'project.view',
  PROJECT_CREATE: 'project.create',
  PROJECT_UPDATE: 'project.update',
  PROJECT_DELETE: 'project.delete',
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
