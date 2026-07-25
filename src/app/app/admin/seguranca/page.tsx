'use client';
import { SecurityForm } from '@/modules/system/components/SecurityForm';
import { ShieldX } from '@/constants/icons';

export default function SegurancaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldX className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Segurança</h1>
          <p className="text-sm text-muted-foreground">Configurações de expiração de sessão, limite de tentativas e bloqueio automático</p>
        </div>
      </div>
      <SecurityForm />
    </div>
  );
}
