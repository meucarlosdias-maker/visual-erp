'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthUser } from '../types';

function mapSupabaseUser(supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.name as string | undefined,
    avatarUrl: supabaseUser.user_metadata?.avatar_url as string | undefined,
    role: supabaseUser.user_metadata?.role as string | undefined,
    type: (supabaseUser.user_metadata?.type as 'platform' | 'company') ?? 'company',
  };
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (supabaseUser) {
          setUser(mapSupabaseUser(supabaseUser));
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, error };
}
