'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/feedback';
import { securityService } from '../services/security-service';
import type { SecuritySettings } from '../types';

export function SecurityForm() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    securityService.get().then(setSettings).finally(() => setLoading(false));
  }, []);

  const update = (key: keyof SecuritySettings, value: unknown) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await securityService.update(settings);
      toast.success('Configurações de segurança salvas');
    } catch { toast.error('Erro ao salvar'); }
    finally { setSaving(false); }
  };

  if (loading || !settings) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Sessão</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiração da Sessão (minutos)</Label>
              <Input type="number" value={settings.sessionExpirationMinutes}
                onChange={(e) => update('sessionExpirationMinutes', Number(e.target.value))} min={5} max={1440} />
            </div>
            <div className="space-y-2">
              <Label>Limite de Sessões Concorrentes</Label>
              <Input type="number" value={settings.sessionConcurrentLimit}
                onChange={(e) => update('sessionConcurrentLimit', Number(e.target.value))} min={1} max={10} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Login e Senha</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Máximo de Tentativas de Login</Label>
              <Input type="number" value={settings.maxLoginAttempts}
                onChange={(e) => update('maxLoginAttempts', Number(e.target.value))} min={1} max={10} />
            </div>
            <div className="space-y-2">
              <Label>Bloqueio Automático (minutos)</Label>
              <Input type="number" value={settings.autoBlockMinutes}
                onChange={(e) => update('autoBlockMinutes', Number(e.target.value))} min={1} max={1440} />
            </div>
            <div className="space-y-2">
              <Label>Tamanho Mínimo da Senha</Label>
              <Input type="number" value={settings.passwordMinLength}
                onChange={(e) => update('passwordMinLength', Number(e.target.value))} min={6} max={128} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={settings.passwordRequireSpecialChar}
                onCheckedChange={(c) => update('passwordRequireSpecialChar', c)} />
              <Label className="mb-0">Exigir caractere especial</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={settings.passwordRequireNumber}
                onCheckedChange={(c) => update('passwordRequireNumber', c)} />
              <Label className="mb-0">Exigir número</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Autenticação Multifator (MFA)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Estrutura preparada para MFA. A implementação completa será feita em versão futura.</p>
          <div className="flex items-center gap-2">
            <Switch checked={settings.mfaEnabled}
              onCheckedChange={(c) => update('mfaEnabled', c)} disabled />
            <Label className="mb-0 text-muted-foreground">Habilitar MFA (indisponível)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
