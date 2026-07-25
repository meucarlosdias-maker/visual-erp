import { z } from 'zod/v4';

export const auditLogSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  userId: z.string(),
  userName: z.string(),
  entityName: z.string(),
  entityId: z.string(),
  action: z.string(),
  module: z.string(),
  oldData: z.record(z.string(), z.unknown()).nullable(),
  newData: z.record(z.string(), z.unknown()).nullable(),
  ip: z.string(),
  browser: z.string(),
  operatingSystem: z.string(),
  userAgent: z.string(),
  executionTime: z.number(),
  createdAt: z.date(),
});

export const logSchema = z.object({
  id: z.string(),
  level: z.string(),
  module: z.string(),
  message: z.string(),
  stack: z.string(),
  createdAt: z.date(),
});

export const roleSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  isSystem: z.boolean(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});
