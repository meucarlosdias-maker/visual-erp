'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { Upload, Trash2 } from '@/constants/icons';
import type { User } from '../types';

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'blocked', label: 'Bloqueado' },
];

interface UserFormProps {
  user?: User | null;
  onSave: (data: Partial<User>) => Promise<boolean>;
  onCancel: () => void;
}

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [telefone, setTelefone] = useState(user?.telefone ?? '');
  const [position, setPosition] = useState(user?.position ?? '');
  const [status, setStatus] = useState(user?.status ?? 'active');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setSaving(true);
    await onSave({ firstName, lastName, email, telefone, position, status, avatarUrl: avatarPreview } as Partial<User>);
    setSaving(false);
  };

  const initials = (firstName[0] + (lastName[0] ?? '')).toUpperCase();
  const dirty =
    firstName !== (user?.firstName ?? '') ||
    lastName !== (user?.lastName ?? '') ||
    email !== (user?.email ?? '') ||
    telefone !== (user?.telefone ?? '') ||
    position !== (user?.position ?? '') ||
    status !== (user?.status ?? 'active') ||
    avatarPreview !== (user?.avatarUrl ?? '');

  return (
    <div className="space-y-6 max-w-lg">
      <Tabs defaultValue="dados-pessoais">
        <TabsList>
          <TabsTrigger value="dados-pessoais">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="acesso">Acesso</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="dados-pessoais" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sobrenome">Sobrenome</Label>
              <Input id="sobrenome" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input id="cargo" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Ex: Designer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-0000" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="acesso" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="avatar" className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
              <AvatarFallback className="text-2xl">{initials || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4" />
                Upload
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarPreview && (
                <Button variant="ghost" size="icon" onClick={() => setAvatarPreview('')}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Formatos: PNG, JPG, WEBP — Máximo 3 MB</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 pt-2 border-t">
        <SaveButton onClick={handleSubmit} loading={saving} disabled={!dirty} />
        <CancelButton onClick={onCancel} disabled={saving} />
      </div>
    </div>
  );
}
