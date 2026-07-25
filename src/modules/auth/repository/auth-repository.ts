import { createClient } from '@/lib/supabase-server';
import type { AuthUser } from '../types';

export const authRepository = {
  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email ?? '',
      name: user.user_metadata?.name,
      avatarUrl: user.user_metadata?.avatar_url,
    };
  },

  async signIn(email: string, password: string) {
    const supabase = await createClient();
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    const supabase = await createClient();
    return supabase.auth.signOut();
  },

  async resetPassword(email: string) {
    const supabase = await createClient();
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/atualizar-senha`,
    });
  },
};