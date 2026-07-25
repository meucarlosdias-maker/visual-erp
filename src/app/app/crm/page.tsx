'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Calendar, BarChart3, FileText, CheckCircle2, Loader2 } from '@/constants/icons';
import { leadService } from '@/modules/crm/services/lead-service';
import { visitService } from '@/modules/crm/services/visit-service';

function formatNumber(v: number): string {
  return v.toLocaleString('pt-BR');
}

interface StatusCounts {
  NEW: number;
  NEGOTIATION: number;
  PROPOSAL_SENT: number;
  WON: number;
  [key: string]: number;
}

export default function CrmDashboardPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<StatusCounts>({ NEW: 0, NEGOTIATION: 0, PROPOSAL_SENT: 0, WON: 0 });
  const [visitsToday, setVisitsToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      leadService.getStatusCounts(),
      visitService.listByLead(),
    ]).then(([statusCounts, visits]) => {
      setCounts({
        NEW: statusCounts.NEW ?? 0,
        NEGOTIATION: statusCounts.NEGOTIATION ?? 0,
        PROPOSAL_SENT: statusCounts.PROPOSAL_SENT ?? 0,
        WON: statusCounts.WON ?? 0,
        ...statusCounts,
      });
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      setVisitsToday(visits.filter((v) => {
        const d = new Date(v.scheduledDate);
        return d.toISOString().slice(0, 10) === todayStr;
      }).length);
    }).finally(() => setLoading(false));
  }, []);

  const totalLeads = Object.values(counts).reduce((a, b) => a + b, 0);
  const conversionRate = totalLeads > 0 ? Math.round((counts.WON / totalLeads) * 100) : 0;

  const cards = [
    { title: 'Novos Leads', value: formatNumber(counts.NEW), icon: Users, color: 'text-blue-600', href: '/app/crm/leads' },
    { title: 'Em Negociação', value: formatNumber(counts.NEGOTIATION), icon: TrendingUp, color: 'text-orange-600', href: '/app/crm/leads' },
    { title: 'Visitas Hoje', value: formatNumber(visitsToday), icon: Calendar, color: 'text-purple-600', href: '/app/crm/agenda' },
    { title: 'Taxa de Conversão', value: `${conversionRate}%`, icon: BarChart3, color: 'text-cyan-600' },
    { title: 'Orçamentos Enviados', value: formatNumber(counts.PROPOSAL_SENT), icon: FileText, color: 'text-indigo-600' },
    { title: 'Vendas Fechadas', value: formatNumber(counts.WON), icon: CheckCircle2, color: 'text-green-600' },
  ];

  return (
    <CrudPage title="CRM" description="Acompanhe seus indicadores comerciais">
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map((card) => (
            <Card key={card.title} className={card.href ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''} onClick={() => card.href && router.push(card.href)}>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><card.icon className="h-4 w-4 text-muted-foreground" /> {card.title}</CardTitle></CardHeader>
              <CardContent><p className={`text-2xl font-bold ${card.color}`}>{card.value}</p></CardContent>
            </Card>
          ))}
        </div>
      )}
    </CrudPage>
  );
}
