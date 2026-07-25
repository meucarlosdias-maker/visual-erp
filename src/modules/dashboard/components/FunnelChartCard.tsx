'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingLocal } from '@/components/feedback';
import type { ChartDataPoint } from '../types';
import { cn } from '@/lib/utils';

interface FunnelChartCardProps {
  title: string;
  data: ChartDataPoint[];
  loading?: boolean;
  className?: string;
}

export function FunnelChartCard({ title, data, loading, className }: FunnelChartCardProps) {
  if (loading) return <Card className={cn('', className)}><CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent><LoadingLocal /></CardContent></Card>;

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, idx) => {
            const widthPct = (item.value / maxValue) * 100;
            const conversion = idx > 0 ? ((item.value / data[idx - 1].value) * 100).toFixed(1) : null;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="relative h-8">
                  <div
                    className="absolute inset-y-0 left-1/2 -translate-x-1/2 rounded bg-primary/20 border border-primary/30 flex items-center justify-center"
                    style={{ width: `${widthPct}%` }}
                  >
                    <span className="text-xs font-medium">{conversion ? `${conversion}%` : '100%'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
