'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyContactsProps {
  telefone: string;
  celular: string;
  email: string;
  site: string;
  whatsapp: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function CompanyContacts({
  telefone, celular, email, site, whatsapp, onChange, disabled,
}: CompanyContactsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="telefone">Telefone</Label>
        <Input id="telefone" value={telefone} onChange={(e) => onChange('telefone', e.target.value)} disabled={disabled} placeholder="(11) 3000-0000" />
      </div>
      <div>
        <Label htmlFor="celular">Celular</Label>
        <Input id="celular" value={celular} onChange={(e) => onChange('celular', e.target.value)} disabled={disabled} placeholder="(11) 99999-0000" />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" value={email} onChange={(e) => onChange('email', e.target.value)} disabled={disabled} />
      </div>
      <div>
        <Label htmlFor="site">Site</Label>
        <Input id="site" value={site} onChange={(e) => onChange('site', e.target.value)} disabled={disabled} placeholder="https://" />
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" value={whatsapp} onChange={(e) => onChange('whatsapp', e.target.value)} disabled={disabled} placeholder="(11) 99999-0000" />
      </div>
    </div>
  );
}
