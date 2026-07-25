'use client';
import { LoadingLocal, EmptyState } from '@/components/feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Pencil, Trash2, Plus } from '@/constants/icons';
import type { Role } from '../types';

interface RolesListProps {
  roles: Role[];
  loading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function RolesList({ roles, loading, onEdit, onDelete, onNew }: RolesListProps) {
  if (loading) return <LoadingLocal />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Papéis ({roles.length})</h2>
        <Button onClick={onNew}><Plus className="mr-2 h-4 w-4" />Novo Papel</Button>
      </div>
      {roles.length === 0 ? (
        <EmptyState icon={<ShieldX className="h-12 w-12 text-muted-foreground" />} title="Nenhum papel" description="Crie papéis para gerenciar permissões." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: role.color }} />
                  <CardTitle className="text-base">{role.name}</CardTitle>
                  {role.isSystem && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Sistema</span>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{role.description || 'Sem descrição'}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${role.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {role.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex gap-1 mt-3">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(role)}><Pencil className="h-4 w-4" /></Button>
                  {!role.isSystem && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(role.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
