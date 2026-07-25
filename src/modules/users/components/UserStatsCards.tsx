'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, OctagonXIcon, InfoIcon } from '@/constants/icons';
import type { User } from '../types';

interface UserStatsCardsProps {
  users: User[];
}

export function UserStatsCards({ users }: UserStatsCardsProps) {
  const total = users.length;
  const ativos = users.filter((u) => u.status === 'active').length;
  const pendentes = users.filter((u) => u.status === 'pending').length;
  const bloqueados = users.filter((u) => u.status === 'blocked').length;

  const cards = [
    { title: 'Total de Usuários', value: total, icon: Users },
    { title: 'Ativos', value: ativos, icon: CheckCircle2 },
    { title: 'Pendentes', value: pendentes, icon: InfoIcon },
    { title: 'Bloqueados', value: bloqueados, icon: OctagonXIcon },
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
