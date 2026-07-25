'use client';

import { Package } from '@/constants/icons';

export default function EstoquePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Estoque</h1>
          <p className="text-sm text-muted-foreground">Controle de estoque e materiais</p>
        </div>
      </div>
    </div>
  );
}
