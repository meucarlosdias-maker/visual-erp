'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, CheckCircle2, FolderKanban, DollarSign } from '@/constants/icons';
import type { Equipment } from '../types';

interface EquipmentStatsCardsProps {
  equipments: Equipment[];
  categoriesCount: number;
}

export function EquipmentStatsCards({ equipments, categoriesCount }: EquipmentStatsCardsProps) {
  const total = equipments.length;
  const ativos = equipments.filter((e) => e.active).length;
  const custos = equipments.reduce((acc, e) => acc + e.hourCost + e.dailyCost + e.kmCost + e.monthlyCost, 0);
  const custoMedio = equipments.length > 0 ? custos / equipments.length : 0;

  const cards = [
    { title: 'Total Equipamentos', value: total, icon: Wrench },
    { title: 'Equipamentos Ativos', value: ativos, icon: CheckCircle2 },
    { title: 'Categorias', value: categoriesCount, icon: FolderKanban },
    { title: 'Custo Médio', value: `R$ ${custoMedio.toFixed(2)}`, icon: DollarSign },
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
