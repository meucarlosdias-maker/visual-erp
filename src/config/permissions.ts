export interface RolePermission {
  role: string;
  permissions: string[];
}

export const companyRolePermissions: RolePermission[] = [
  {
    role: 'ADMIN',
    permissions: [
      'company.view', 'company.edit', 'company.upload_logo',
      'company.settings', 'company.users',
      'user:*', 'client:*', 'project:*',
      'crm:*', 'catalog:*', 'quotation:*',
      'production:*', 'installation:*',
      'financial:*', 'report:*',
      'api.view', 'api.manage', 'api.keys', 'api.webhooks', 'api.logs',
      'workflow.view', 'workflow.create', 'workflow.edit', 'workflow.execute', 'workflow.logs',
      'ai.view', 'ai.chat', 'ai.prompts', 'ai.providers', 'ai.history',
      'knowledge.view', 'knowledge.create', 'knowledge.upload', 'knowledge.search', 'knowledge.manage',
      'plugins.view', 'plugins.install', 'plugins.enable', 'plugins.remove', 'plugins.marketplace',
      'communication.view', 'communication.send', 'communication.manage',
      'notifications.manage', 'templates.manage',
      'builder.view', 'builder.create', 'builder.edit', 'builder.delete', 'builder.publish',
      'portal.client', 'portal.employee',
      'mobile.access', 'mobile.offline', 'mobile.notifications',
      'jobs.view', 'jobs.execute', 'jobs.manage',
      'scheduler.manage', 'events.view',
      'system.monitoring', 'system.logs', 'system.health', 'system.backups',
      'team.view', 'team.manage', 'team.productivity',
      'equipment.view', 'equipment.manage',
      'material.view', 'material.manage',
      'schedule.view', 'schedule.manage',
    ],
  },
  {
    role: 'MANAGER',
    permissions: [
      'company.view',
      'client:view', 'client:create', 'client:update',
      'project:*',
      'crm:view', 'crm:edit',
      'production:view', 'production:edit',
      'quotation:view', 'quotation:create',
      'schedule.view', 'schedule.manage',
      'team.view',
      'report:view',
      'ai.chat',
    ],
  },
  {
    role: 'SALES',
    permissions: [
      'company.view',
      'client:*',
      'crm:*',
      'quotation:*',
      'catalog:view',
      'project:view',
      'schedule.view',
      'report:view',
    ],
  },
  {
    role: 'DESIGNER',
    permissions: [
      'company.view',
      'project:view', 'project:edit',
      'production:view',
      'material:view',
      'catalog:view',
    ],
  },
  {
    role: 'PRODUCTION',
    permissions: [
      'company.view',
      'project:view',
      'production:*',
      'installation:view',
      'material:view',
      'equipment:view',
      'schedule.view',
    ],
  },
  {
    role: 'INSTALLER',
    permissions: [
      'company.view',
      'installation:*',
      'project:view',
      'schedule.view',
    ],
  },
  {
    role: 'FINANCE',
    permissions: [
      'company.view',
      'financial:*',
      'report:*',
      'client:view',
      'project:view',
      'quotation:view',
    ],
  },
  {
    role: 'VIEWER',
    permissions: [
      'company.view',
      'client:view',
      'project:view',
      'crm:view',
      'quotation:view',
      'report:view',
    ],
  },
];

export const platformRolePermissions: RolePermission[] = [
  {
    role: 'SUPER_ADMIN',
    permissions: ['*'],
  },
  {
    role: 'DEVELOPER',
    permissions: [
      'platform.view',
      'platform.companies',
      'platform.users',
      'platform.licenses',
      'platform.metrics',
      'platform.settings',
      'platform.logs',
      'platform.audit',
      'system.health',
      'system.monitoring',
      'system.logs',
      'system.backups',
      'system.deployments',
    ],
  },
  {
    role: 'SUPPORT',
    permissions: [
      'platform.view',
      'platform.companies',
      'platform.users',
      'platform.licenses',
      'platform.settings',
    ],
  },
  {
    role: 'FINANCE',
    permissions: [
      'platform.view',
      'platform.companies',
      'platform.plans',
      'platform.licenses',
      'platform.billing',
      'platform.metrics',
      'report:view',
    ],
  },
  {
    role: 'COMMERCIAL',
    permissions: [
      'platform.view',
      'platform.companies',
      'platform.plans',
      'platform.metrics',
      'platform.announcements',
    ],
  },
];
