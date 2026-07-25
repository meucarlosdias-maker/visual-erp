'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CheckCircle2, FolderKanban, AlertTriangle } from '@/constants/icons';
import type { Material } from '../types';

interface MaterialStatsCardsProps {
  materials: Material[];
  categoriesCount?: number;
}

export function MaterialStatsCards({ materials, categoriesCount = 0 }: MaterialStatsCardsProps) {
  const total = materials.length;
  const ativos = materials.filter((m) => m.active).length;
  const estoqueBaixo = materials.filter((m) => m.currentStock < m.minimumStock).length;

  const cards = [
    { title: 'Total Materiais', value: total, icon: Package },
    { title: 'Categorias', value: categoriesCount, icon: FolderKanban },
    { title: 'Estoque Baixo', value: estoqueBaixo, icon: AlertTriangle },
    { title: 'Materiais Ativos', value: ativos, icon: CheckCircle2 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
