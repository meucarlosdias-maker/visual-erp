'use client';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingLocal } from '@/components/feedback';
import { toast } from '@/components/feedback';
import { Save } from '@/constants/icons';
import { SYSTEM_MODULES, SYSTEM_ACTIONS, MODULE_LABELS, ACTION_LABELS } from '../validators';
import { roleService } from '../services/role-service';
import { permissionService } from '../services/permission-service';
import type { Permission } from '../types';

export function PermissionsMatrix() {
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [rolePermIds, setRolePermIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      roleService.list(),
      permissionService.list(),
    ]).then(([r, p]) => {
      setRoles(r.map((role) => ({ id: role.id, name: role.name })));
      setPermissions(p);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedRole) { setRolePermIds([]); return; }
    permissionService.getRolePermissions(selectedRole).then(setRolePermIds);
  }, [selectedRole]);

  const toggleCell = (permId: string) => {
    setRolePermIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const toggleRow = (module: string, checked: boolean) => {
    const modulePermIds = permissions.filter((p) => p.module === module).map((p) => p.id);
    setRolePermIds((prev) =>
      checked
        ? [...new Set([...prev, ...modulePermIds])]
        : prev.filter((id) => !modulePermIds.includes(id))
    );
  };

  const toggleCol = (action: string, checked: boolean) => {
    const actionPermIds = permissions.filter((p) => p.action === action).map((p) => p.id);
    setRolePermIds((prev) =>
      checked
        ? [...new Set([...prev, ...actionPermIds])]
        : prev.filter((id) => !actionPermIds.includes(id))
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await permissionService.setRolePermissions(selectedRole, rolePermIds);
      toast.success('Permissões salvas');
    } catch { toast.error('Erro ao salvar'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingLocal />;

  const modulePerms = SYSTEM_MODULES.map((mod) => ({
    module: mod,
    label: MODULE_LABELS[mod] ?? mod,
    perms: permissions.filter((p) => p.module === mod),
  }));

  const rowCheckAll = (mod: string) =>
    permissions.filter((p) => p.module === mod).every((p) => rolePermIds.includes(p.id));

  const colCheckAll = (action: string) =>
    permissions.filter((p) => p.action === action).every((p) => rolePermIds.includes(p.id));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-base">Matriz de Permissões</CardTitle>
          <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val ?? '')}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Selecione um papel" /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={handleSave} disabled={!selectedRole || saving}>
          <Save className="mr-2 h-4 w-4" />{saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent>
        {!selectedRole ? (
          <p className="text-sm text-muted-foreground text-center py-8">Selecione um papel para gerenciar permissões</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium">Módulo</th>
                  {SYSTEM_ACTIONS.map((action) => (
                    <th key={action} className="text-center px-2 py-2 font-medium">
                      <div className="flex flex-col items-center gap-1">
                        <span>{ACTION_LABELS[action]}</span>
                        <Checkbox
                          checked={colCheckAll(action)}
                          onCheckedChange={(checked) => toggleCol(action, !!checked)}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modulePerms.map(({ module: mod, label, perms }) => (
                  <tr key={mod} className="border-b hover:bg-muted/50">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={rowCheckAll(mod)}
                          onCheckedChange={(checked) => toggleRow(mod, !!checked)}
                        />
                        <span className="font-medium">{label}</span>
                      </div>
                    </td>
                    {SYSTEM_ACTIONS.map((action) => {
                      const perm = perms.find((p) => p.action === action);
                      return (
                        <td key={`${mod}-${action}`} className="text-center px-2 py-2">
                          {perm ? (
                            <Checkbox
                              checked={rolePermIds.includes(perm.id)}
                              onCheckedChange={() => toggleCell(perm.id)}
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
