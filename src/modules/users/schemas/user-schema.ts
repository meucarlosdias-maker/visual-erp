import { z } from 'zod/v4';

const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

export const userRoleSchema = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'TEAM_MEMBER',
  'VIEWER',
]);

export type UserRole = z.infer<typeof userRoleSchema>;

export const userStatusSchema = z.enum(['active', 'inactive', 'pending', 'blocked']);

export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: z.string(),
  companyId: z.string(),

  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').or(z.literal('')).optional().default(''),
  position: z.string().optional().default(''),

  role: userRoleSchema.default('TEAM_MEMBER'),
  roleId: z.string().nullable().optional().default(null),
  status: userStatusSchema.default('active'),
  lastLogin: z.instanceof(Date).nullable().optional().default(null),
  emailVerified: z.boolean().default(false),

  avatarUrl: z.string().optional().default(''),

  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  updatedAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  deletedAt: z.instanceof(Date).nullable().optional().default(null),
  createdBy: z.string().nullable().optional().default(null),
  updatedBy: z.string().nullable().optional().default(null),
  deletedBy: z.string().nullable().optional().default(null),
});

export type UserSchemaType = z.infer<typeof userSchema>;

export const userInviteSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().regex(phoneRegex, 'Telefone inválido').or(z.literal('')).optional().default(''),
  position: z.string().optional().default(''),
  role: userRoleSchema.default('TEAM_MEMBER'),
  companyId: z.string(),
});

export type UserInviteType = z.infer<typeof userInviteSchema>;

export const userUpdateSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  telefone: z.string().optional(),
  position: z.string().optional(),
  role: userRoleSchema.optional(),
  roleId: z.string().nullable().optional(),
  status: userStatusSchema.optional(),
  avatarUrl: z.string().optional(),
});

export type UserUpdateType = z.infer<typeof userUpdateSchema>;

export const inviteStatusSchema = z.enum(['pending', 'accepted', 'expired', 'cancelled']);

export type InviteStatus = z.infer<typeof inviteStatusSchema>;

export const inviteSchema = z.object({
  id: z.string(),
  email: z.string().email('E-mail inválido'),
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  token: z.string(),
  status: inviteStatusSchema.default('pending'),
  role: userRoleSchema.default('TEAM_MEMBER'),
  companyId: z.string(),
  createdAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  expiresAt: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
});

export type InviteSchemaType = z.infer<typeof inviteSchema>;
