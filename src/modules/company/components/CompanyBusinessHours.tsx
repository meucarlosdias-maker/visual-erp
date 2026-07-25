'use client';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CompanyBusinessHoursProps {
  horarioInicio: string;
  horarioFim: string;
  trabalhaSabado: boolean;
  trabalhaDomingo: boolean;
  onChange: (field: string, value: string | boolean) => void;
  disabled?: boolean;
}

export function CompanyBusinessHours({
  horarioInicio, horarioFim, trabalhaSabado, trabalhaDomingo, onChange, disabled,
}: CompanyBusinessHoursProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="horarioInicio">Horário de Abertura</Label>
          <Input id="horarioInicio" type="time" value={horarioInicio}
            onChange={(e) => onChange('horarioInicio', e.target.value)} disabled={disabled} />
        </div>
        <div>
          <Label htmlFor="horarioFim">Horário de Fechamento</Label>
          <Input id="horarioFim" type="time" value={horarioFim}
            onChange={(e) => onChange('horarioFim', e.target.value)} disabled={disabled} />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch id="trabalhaSabado" checked={trabalhaSabado}
            onCheckedChange={(v) => onChange('trabalhaSabado', v)} disabled={disabled} />
          <Label htmlFor="trabalhaSabado">Trabalha aos sábados</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="trabalhaDomingo" checked={trabalhaDomingo}
            onCheckedChange={(v) => onChange('trabalhaDomingo', v)} disabled={disabled} />
          <Label htmlFor="trabalhaDomingo">Trabalha aos domingos</Label>
        </div>
      </div>
    </div>
  );
}
