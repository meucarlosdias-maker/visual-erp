'use server';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { loginSchema, resetPasswordSchema, updatePasswordSchema } from '../schemas';

export async function login(_prevState: { error: string } | undefined, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(', ') };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  redirect('/app');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}

export async function updatePassword(_prevState: { error: string } | { success: boolean } | undefined, formData: FormData) {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(', ') };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  return { success: true };
}

export async function resetPassword(_prevState: { error: string } | { success: boolean } | undefined, formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    email: formData.get('email'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(', ') };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/atualizar-senha`,
  });
  if (error) return { error: error.message };

  return { success: true };
}
