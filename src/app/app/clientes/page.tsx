'use client';

import { Users } from '@/constants/icons';

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gestão de clientes</p>
        </div>
      </div>
    </div>
  );
}
