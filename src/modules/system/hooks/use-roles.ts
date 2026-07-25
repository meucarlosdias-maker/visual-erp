'use client';
import { useState, useEffect, useCallback } from 'react';
import { roleService } from '../services/role-service';
import type { Role, RoleForm } from '../types';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setRoles(await roleService.list()); }
    catch { setError('Erro ao carregar papéis'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { roles, loading, error, reload: load };
}

export function useRole(id: string | undefined) {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    roleService.getById(id).then(setRole).finally(() => setLoading(false));
  }, [id]);

  return { role, loading };
}

export function useRoleForm() {
  const [saving, setSaving] = useState(false);

  const save = useCallback(async (data: RoleForm, id?: string) => {
    setSaving(true);
    try {
      if (id) await roleService.update(id, data);
      else await roleService.create(data);
    } finally { setSaving(false); }
  }, []);

  const remove = useCallback(async (id: string) => {
    await roleService.delete(id);
  }, []);

  return { saving, save, remove };
}
