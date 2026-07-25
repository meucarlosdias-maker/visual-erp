import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});
export type LoginType = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});
export type UpdatePasswordType = z.infer<typeof updatePasswordSchema>;
