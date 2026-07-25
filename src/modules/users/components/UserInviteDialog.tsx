'use client';

import { useState } from 'react';
import { Modal } from '@/components/feedback';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleLabels } from '@/constants/roles';

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (data: { firstName: string; lastName: string; email: string; telefone?: string; position?: string; role: string; companyId: string }) => Promise<boolean>;
}

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

export function UserInviteDialog({ open, onOpenChange, onInvite }: UserInviteDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('TEAM_MEMBER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const ok = await onInvite({ firstName, lastName, email, telefone, position, role, companyId: COMPANY_ID });
    setLoading(false);
    if (ok) {
      onOpenChange(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setTelefone('');
      setPosition('');
      setRole('TEAM_MEMBER');
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Convidar Usuário"
      description="O usuário receberá um e-mail com instruções de acesso."
      size="sm"
      submitLabel="Convidar"
      onSubmit={handleSubmit}
      loading={loading}
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invite-nome">Nome</Label>
              <Input
                id="invite-nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-sobrenome">Sobrenome</Label>
              <Input
                id="invite-sobrenome"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              placeholder="Sobrenome"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-email">E-mail</Label>
          <Input
            id="invite-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invite-telefone">Telefone</Label>
            <Input
              id="invite-telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-0000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-cargo">Cargo</Label>
              <Input
                id="invite-cargo"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              placeholder="Ex: Designer"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="invite-role">Perfil</Label>
          <Select value={role} onValueChange={(v) => v && setRole(v)}>
            <SelectTrigger id="invite-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RoleLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
