'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Wrench } from '@/constants/icons';

interface DashboardCardsProps {
  todayCount: number;
  installationsCount: number;
  visitsCount: number;
  productionsCount: number;
}

export function DashboardCards({ todayCount, installationsCount, visitsCount, productionsCount }: DashboardCardsProps) {
  const cards = [
    { icon: Clock, label: 'Eventos Hoje', value: todayCount, color: 'text-blue-600' },
    { icon: Wrench, label: 'Próximas Instalações', value: installationsCount, color: 'text-orange-600' },
    { icon: MapPin, label: 'Visitas Agendadas', value: visitsCount, color: 'text-purple-600' },
    { icon: Calendar, label: 'Produções Programadas', value: productionsCount, color: 'text-indigo-600' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="p-0 shadow-none border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <c.icon className={`h-5 w-5 ${c.color}`} />
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{c.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
