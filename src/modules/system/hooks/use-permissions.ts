'use client';
import { useState, useEffect, useCallback } from 'react';
import { permissionService } from '../services/permission-service';
import type { Permission } from '../types';

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    permissionService.list().then(setPermissions).finally(() => setLoading(false));
  }, []);

  return { permissions, loading };
}

export function useRolePermissions(roleId: string | null) {
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!roleId) return;
    setLoading(true);
    try { setPermissionIds(await permissionService.getRolePermissions(roleId)); }
    finally { setLoading(false); }
  }, [roleId]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (permIds: string[]) => {
    if (!roleId) return;
    await permissionService.setRolePermissions(roleId, permIds);
    setPermissionIds(permIds);
  }, [roleId]);

  return { permissionIds, loading, save, reload: load };
}
