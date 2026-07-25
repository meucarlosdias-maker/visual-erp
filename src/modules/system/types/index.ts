export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  entityName: string;
  entityId: string;
  action: string;
  module: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ip: string;
  browser: string;
  operatingSystem: string;
  userAgent: string;
  executionTime: number;
  createdAt: Date;
}

export interface SystemLog {
  id: string;
  level: string;
  module: string;
  message: string;
  stack: string;
  createdAt: Date;
}

export interface Permission {
  id: string;
  module: string;
  action: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  companyId: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RoleForm {
  name: string;
  description: string;
  color: string;
  isSystem?: boolean;
  active?: boolean;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
}

export interface UserSession {
  id: string;
  userId: string;
  userName: string;
  device: string;
  browser: string;
  operatingSystem: string;
  ip: string;
  country: string;
  city: string;
  startedAt: Date;
  lastActivity: Date;
  finishedAt: Date | null;
  active: boolean;
}

export interface SecuritySettings {
  sessionExpirationMinutes: number;
  maxLoginAttempts: number;
  autoBlockMinutes: number;
  mfaEnabled: boolean;
  mfaMethod: string;
  passwordMinLength: number;
  passwordRequireSpecialChar: boolean;
  passwordRequireNumber: boolean;
  sessionConcurrentLimit: number;
}
