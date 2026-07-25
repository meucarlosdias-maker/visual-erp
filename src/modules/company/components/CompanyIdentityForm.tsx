'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from '@/constants/icons';
import { toast } from '@/components/feedback';
import type { CompanySettings } from '../types/company-settings';

interface Props {
  settings: CompanySettings;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
}

export function CompanyIdentityForm({ settings, onSave }: Props) {
  const [form, setForm] = useState({
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo || null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(settings.favicon || null);
  const [saving, setSaving] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined, setPreview: (v: string | null) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave({ ...form, logo: logoPreview || '', favicon: faviconPreview || '' });
    if (ok) toast.success('Identidade visual salva');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Logo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {logoPreview && (
            <div className="relative w-48 h-32 rounded border flex items-center justify-center bg-muted/20">
              <img src={logoPreview} alt="Logo" className="max-w-full max-h-full object-contain" />
              <button className="absolute top-1 right-1 p-1 rounded bg-background/80 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => { setLogoPreview(null); if (logoRef.current) logoRef.current.value = ''; }}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <input ref={logoRef} type="file" accept="image/*" className="text-sm" onChange={(e) => handleFile(e.target.files?.[0], setLogoPreview)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Favicon</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {faviconPreview && (
            <div className="relative w-12 h-12 rounded border flex items-center justify-center bg-muted/20">
              <img src={faviconPreview} alt="Favicon" className="max-w-full max-h-full object-contain" />
              <button className="absolute -top-1 -right-1 p-0.5 rounded-full bg-background/80 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => { setFaviconPreview(null); if (faviconRef.current) faviconRef.current.value = ''; }}>
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
          <input ref={faviconRef} type="file" accept="image/*" className="text-sm" onChange={(e) => handleFile(e.target.files?.[0], setFaviconPreview)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Cores</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Cor Primária</Label>
            <div className="flex gap-2 items-center">
              <Input type="color" value={form.primaryColor} onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))} className="w-12 h-10 p-1" />
              <Input value={form.primaryColor} onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cor Secundária</Label>
            <div className="flex gap-2 items-center">
              <Input type="color" value={form.secondaryColor} onChange={(e) => setForm((p) => ({ ...p, secondaryColor: e.target.value }))} className="w-12 h-10 p-1" />
              <Input value={form.secondaryColor} onChange={(e) => setForm((p) => ({ ...p, secondaryColor: e.target.value }))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </div>
  );
}
