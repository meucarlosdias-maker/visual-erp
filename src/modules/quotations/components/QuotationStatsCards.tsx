'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, CheckCircle2, Clock } from '@/constants/icons';
import type { Quotation } from '../types';

interface QuotationStatsCardsProps {
  quotations: Quotation[];
  loading: boolean;
}

export function QuotationStatsCards({ quotations, loading }: QuotationStatsCardsProps) {
  const total = quotations.length;
  const approved = quotations.filter((q) => q.status === 'APPROVED').length;
  const draft = quotations.filter((q) => q.status === 'DRAFT').length;
  const avgTicket = total > 0
    ? quotations.reduce((sum, q) => sum + q.total, 0) / total
    : 0;

  const cards = [
    { title: 'Total', value: total, icon: FileText },
    { title: 'Aprovados', value: approved, icon: CheckCircle2 },
    { title: 'Rascunhos', value: draft, icon: Clock },
    { title: 'Ticket Médio', value: `R$ ${avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign },
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
            <p className="text-2xl font-bold">
              {loading ? '...' : String(card.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
