'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { FinancialDashboard } from '@/modules/financial/components/FinancialDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from '@/constants/icons';

const quickLinks = [
  { title: 'Contas a Receber', href: '/app/financeiro/receber', icon: TrendingUp, color: 'text-green-600' },
  { title: 'Contas a Pagar', href: '/app/financeiro/pagar', icon: TrendingDown, color: 'text-red-600' },
  { title: 'Fluxo de Caixa', href: '/app/financeiro/fluxo-caixa', icon: BarChart3, color: 'text-blue-600' },
];

export default function FinanceiroPage() {
  const router = useRouter();

  return (
    <CrudPage title="Financeiro" description="Gerencie as finanças da empresa">
      <FinancialDashboard />

      <div className="grid gap-4 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.href} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => router.push(link.href)}>
            <CardHeader className="pb-2"><CardTitle className={`text-sm font-medium flex items-center gap-2 ${link.color}`}><link.icon className="h-4 w-4" /> {link.title}</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Acessar {link.title.toLowerCase()}</p></CardContent>
          </Card>
        ))}
      </div>
    </CrudPage>
  );
}
