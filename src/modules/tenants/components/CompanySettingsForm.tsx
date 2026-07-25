'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from '@/constants/icons';
import type { CompanySettingsInfo } from '@/core/tenant';
import { CompanySettingsService } from '../services';

export function CompanySettingsForm({ settings, onSuccess }: { settings: CompanySettingsInfo | null; onSuccess: () => void }) {
  const [theme, setTheme] = useState(settings?.theme ?? 'light');
  const [primaryColor, setPrimaryColor] = useState(settings?.primaryColor ?? '#3b82f6');
  const [logoDarkUrl, setLogoDarkUrl] = useState(settings?.logoDarkUrl ?? '');
  const [logoLightUrl, setLogoLightUrl] = useState(settings?.logoLightUrl ?? '');
  const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await CompanySettingsService.update(settings?.companyId ?? '', {
        theme,
        primaryColor,
        logoDarkUrl: logoDarkUrl || null,
        logoLightUrl: logoLightUrl || null,
        faviconUrl: faviconUrl || null,
      });
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Personalização</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select value={theme} onValueChange={(v) => setTheme(v ?? 'light')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cor Primária</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 p-1"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Logo (modo escuro) — URL</Label>
            <Input value={logoDarkUrl} onChange={(e) => setLogoDarkUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Logo (modo claro) — URL</Label>
            <Input value={logoLightUrl} onChange={(e) => setLogoLightUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Favicon — URL</Label>
            <Input value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
