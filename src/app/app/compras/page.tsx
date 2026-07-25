'use client';

import { Truck } from '@/constants/icons';

export default function ComprasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Compras</h1>
          <p className="text-sm text-muted-foreground">Gestão de compras e fornecedores</p>
        </div>
      </div>
    </div>
  );
}
