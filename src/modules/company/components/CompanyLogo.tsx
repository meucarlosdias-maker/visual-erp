'use client';

import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from '@/constants/icons';
import { Button } from '@/components/ui/button';
import { uploadService } from '../services/upload-service';

interface CompanyLogoProps {
  logoUrl: string;
  faviconUrl: string;
  companyName: string;
  onLogoUpload: (file: File) => void;
  onFaviconUpload: (file: File) => void;
  disabled?: boolean;
}

export function CompanyLogo({
  logoUrl, faviconUrl, companyName,
  onLogoUpload, onFaviconUpload, disabled,
}: CompanyLogoProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [faviconError, setFaviconError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const currentLogo = logoPreview || logoUrl;
  const currentFavicon = faviconPreview || faviconUrl;

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    const validation = uploadService.validateLogo(file);
    if (!validation.valid) {
      setLogoError(validation.error ?? 'Arquivo inválido');
      return;
    }
    setLogoError(null);
    setLogoPreview(URL.createObjectURL(file));
    onLogoUpload(file);
  };

  const handleFaviconFile = (file: File | undefined) => {
    if (!file) return;
    const validation = uploadService.validateFavicon(file);
    if (!validation.valid) {
      setFaviconError(validation.error ?? 'Arquivo inválido');
      return;
    }
    setFaviconError(null);
    setFaviconPreview(URL.createObjectURL(file));
    onFaviconUpload(file);
  };

  return (
    <div className="flex items-start gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Logomarca</p>
        <p className="text-xs text-muted-foreground">PNG, JPG ou SVG · Máx 5 MB</p>
        <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted overflow-hidden">
          {currentLogo ? (
            <img src={currentLogo} alt={companyName} className="h-full w-full object-contain" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => logoRef.current?.click()}>
            {currentLogo ? 'Trocar' : 'Selecionar'}
          </Button>
          {currentLogo && (
            <Button type="button" variant="ghost" size="sm" disabled={disabled}
              onClick={() => { setLogoPreview(null); setLogoError(null); }}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        {logoError && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" /> {logoError}
          </p>
        )}
        <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden"
          onChange={(e) => handleLogoFile(e.target.files?.[0])} />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Favicon</p>
        <p className="text-xs text-muted-foreground">PNG, ICO ou SVG · Máx 1 MB</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted overflow-hidden">
          {currentFavicon ? (
            <img src={currentFavicon} alt="favicon" className="h-full w-full object-contain" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => faviconRef.current?.click()}>
          Trocar
        </Button>
        {faviconError && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" /> {faviconError}
          </p>
        )}
        <input ref={faviconRef} type="file" accept="image/png,image/x-icon,image/svg+xml" className="hidden"
          onChange={(e) => handleFaviconFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
