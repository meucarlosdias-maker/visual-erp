'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTree, CheckCircle2, OctagonXIcon } from '@/constants/icons';
import type { ServiceSubcategory } from '../types';

interface ServiceSubcategoryStatsCardsProps {
  subcategories: ServiceSubcategory[];
}

export function ServiceSubcategoryStatsCards({ subcategories }: ServiceSubcategoryStatsCardsProps) {
  const total = subcategories.length;
  const ativos = subcategories.filter((c) => c.active).length;
  const inativos = subcategories.filter((c) => !c.active).length;

  const cards = [
    { title: 'Total', value: total, icon: ListTree },
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
