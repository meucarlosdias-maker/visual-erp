'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CheckCircle2, OctagonXIcon } from '@/constants/icons';
import type { CatalogService } from '../types';

interface CatalogServiceStatsCardsProps {
  services: CatalogService[];
}

export function CatalogServiceStatsCards({ services }: CatalogServiceStatsCardsProps) {
  const total = services.length;
  const ativos = services.filter((c) => c.active).length;
  const inativos = services.filter((c) => !c.active).length;

  const cards = [
    { title: 'Total', value: total, icon: Package },
    { title: 'Ativos', value: ativos, icon: CheckCircle2 },
    { title: 'Inativos', value: inativos, icon: OctagonXIcon },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
