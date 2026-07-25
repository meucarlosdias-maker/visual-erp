'use client';

import { ShoppingBag } from '@/constants/icons';

export default function VendasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-sm text-muted-foreground">Gestão de vendas</p>
        </div>
      </div>
    </div>
  );
}
