'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { UserForm } from '@/modules/users/components/UserForm';
import { useUsers } from '@/modules/users/hooks/use-users';
import { toast } from '@/components/feedback';
import type { User } from '@/modules/users/types';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { invite } = useUsers();

  const handleSave = async (data: Partial<User>) => {
    const ok = await invite({
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      email: data.email ?? '',
      telefone: data.telefone ?? '',
      position: data.position ?? '',
      role: data.role ?? 'TEAM_MEMBER',
      companyId: '00000000-0000-0000-0000-000000000000',
    });
    if (ok) {
      toast.success('Usuário criado com sucesso');
      router.push('/app/configuracoes/usuarios');
    }
    return ok;
  };

  return (
    <CrudPage title="Novo Usuário" description="Cadastre um novo usuário no sistema">
      <UserForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
