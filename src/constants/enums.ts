export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  VIEWER = 'VIEWER',
}

export enum ProjectStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum EntityType {
  COMPANY = 'company',
  USER = 'user',
  CLIENT = 'client',
  PROJECT = 'project',
  SCOPE = 'scope',
  PROJECT_ITEM = 'project_item',
  TEMPLATE = 'template',
}
