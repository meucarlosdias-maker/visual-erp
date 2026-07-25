'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User, UserInvite, UserUpdate } from '../types';
import { userService } from '../services/user-service';

export function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userService.list();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const invite = useCallback(async (data_: UserInvite): Promise<boolean> => {
    try {
      await userService.invite(data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao convidar usuário');
      return false;
    }
  }, [fetch]);

  const update = useCallback(async (id: string, data_: UserUpdate): Promise<boolean> => {
    try {
      await userService.update(id, data_);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      return false;
    }
  }, [fetch]);

  const toggleActive = useCallback(async (id: string, current: string): Promise<boolean> => {
    try {
      await userService.toggleActive(id, current);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar status');
      return false;
    }
  }, [fetch]);

  const del = useCallback(async (id: string): Promise<boolean> => {
    try {
      await userService.delete(id);
      await fetch();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover usuário');
      return false;
    }
  }, [fetch]);

  return { data, loading, error, invite, update, toggleActive, delete: del };
}

export function useUser(id: string | null) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    userService.get(id)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar usuário'))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
