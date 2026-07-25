'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, User, DollarSign } from '@/constants/icons';
import type { Team } from '../types';

interface TeamStatsCardsProps {
  teams: Team[];
  totalMembers: number;
}

export function TeamStatsCards({ teams, totalMembers }: TeamStatsCardsProps) {
  const total = teams.length;
  const ativas = teams.filter((t) => t.active).length;
  const custoMedioHora = teams.length
    ? teams.reduce((acc, t) => acc + t.hourCost, 0) / teams.length
    : 0;

  const cards = [
    { title: 'Total Equipes', value: total, icon: Users },
    { title: 'Total Integrantes', value: totalMembers, icon: User },
    { title: 'Equipes Ativas', value: ativas, icon: CheckCircle2 },
    { title: 'Custo Médio Hora', value: `R$ ${custoMedioHora.toFixed(2)}`, icon: DollarSign },
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
