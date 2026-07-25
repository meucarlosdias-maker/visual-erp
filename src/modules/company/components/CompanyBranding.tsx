'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CompanyLogo } from './CompanyLogo';

interface CompanyBrandingProps {
  logoUrl: string;
  faviconUrl: string;
  corPrimaria: string;
  corSecundaria: string;
  nomeFantasia: string;
  onLogoUpload: (file: File) => void;
  onFaviconUpload: (file: File) => void;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function CompanyBranding({
  logoUrl, faviconUrl, corPrimaria, corSecundaria, nomeFantasia,
  onLogoUpload, onFaviconUpload, onChange, disabled,
}: CompanyBrandingProps) {
  return (
    <div className="space-y-6">
      <CompanyLogo
        logoUrl={logoUrl}
        faviconUrl={faviconUrl}
        companyName={nomeFantasia}
        onLogoUpload={onLogoUpload}
        onFaviconUpload={onFaviconUpload}
        disabled={disabled}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="corPrimaria">Cor Primária</Label>
          <div className="flex gap-2">
            <Input id="corPrimaria" value={corPrimaria}
              onChange={(e) => onChange('corPrimaria', e.target.value)} disabled={disabled}
              className="font-mono" />
            <input type="color" value={corPrimaria}
              onChange={(e) => onChange('corPrimaria', e.target.value)}
              className="h-9 w-9 rounded-md border cursor-pointer" disabled={disabled} />
          </div>
        </div>
        <div>
          <Label htmlFor="corSecundaria">Cor Secundária</Label>
          <div className="flex gap-2">
            <Input id="corSecundaria" value={corSecundaria}
              onChange={(e) => onChange('corSecundaria', e.target.value)} disabled={disabled}
              className="font-mono" />
            <input type="color" value={corSecundaria}
              onChange={(e) => onChange('corSecundaria', e.target.value)}
              className="h-9 w-9 rounded-md border cursor-pointer" disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
}
