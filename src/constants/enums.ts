export enum CompanyRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SALES = 'SALES',
  DESIGNER = 'DESIGNER',
  PRODUCTION = 'PRODUCTION',
  INSTALLER = 'INSTALLER',
  FINANCE = 'FINANCE',
  VIEWER = 'VIEWER',
}

export enum PlatformRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DEVELOPER = 'DEVELOPER',
  SUPPORT = 'SUPPORT',
  FINANCE = 'FINANCE',
  COMMERCIAL = 'COMMERCIAL',
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
