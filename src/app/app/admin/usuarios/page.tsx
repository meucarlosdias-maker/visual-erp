'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingLocal, EmptyState, toast } from '@/components/feedback';
import { useDeleteConfirm } from '@/hooks/use-confirm';
import { useUsers } from '@/modules/users/hooks/use-users';
import { useRoles } from '@/modules/system/hooks/use-roles';
import { useSessions } from '@/modules/system/hooks/use-sessions';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Users, Search, UserCheck } from '@/constants/icons';

export default function AdminUsuariosPage() {
  const { data: users, loading, update, delete: remove } = useUsers();
  const { roles } = useRoles();
  const { sessions } = useSessions();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [search, setSearch] = useState('');

  const userSessions = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      if (s.active) map.set(s.userId, (map.get(s.userId) ?? 0) + 1);
    }
    return map;
  }, [sessions]);

  const filtered = users.filter((u) =>
    !search ||
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, roleId: string | null) => {
    await update(userId, { roleId });
    toast.success('Papel atualizado');
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete({ description: 'Tem certeza que deseja remover este usuário?' });
    if (!confirmed) return;
    await remove(id);
    toast.success('Usuário removido');
  };

  if (loading) return <LoadingLocal />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-sm text-muted-foreground">{users.length} usuário(s) cadastrado(s)</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-12 w-12 text-muted-foreground" />} title="Nenhum usuário" description="Nenhum usuário encontrado." />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead>Sessões Ativas</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.firstName} {u.lastName}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'active' ? 'default' : u.status === 'pending' ? 'secondary' : 'outline'}>
                      {u.status === 'active' ? 'Ativo' : u.status === 'inactive' ? 'Inativo' : u.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={u.roleId ?? ''} onValueChange={(v) => handleRoleChange(u.id, v)}>
                      <SelectTrigger className="w-40 h-8 text-sm">
                        <SelectValue placeholder="Sem papel" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">
                    {u.lastLogin
                      ? u.lastLogin.toLocaleString('pt-BR')
                      : <span className="text-muted-foreground">Nunca</span>
                    }
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-sm">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      {userSessions.get(u.id) ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>Remover</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {DeleteDialog}
    </div>
  );
}
