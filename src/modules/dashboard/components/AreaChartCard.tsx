'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingLocal } from '@/components/feedback';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '../types';
import { cn } from '@/lib/utils';

interface AreaChartCardProps {
  title: string;
  data: ChartDataPoint[];
  loading?: boolean;
  className?: string;
  dataKey?: string;
  secondaryKey?: string;
}

export function AreaChartCard({ title, data, loading, className, dataKey = 'value', secondaryKey }: AreaChartCardProps) {
  if (loading) return <Card className={cn('', className)}><CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent><LoadingLocal /></CardContent></Card>;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip />
              <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
              {secondaryKey && <Area type="monotone" dataKey={secondaryKey} stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.2)" strokeWidth={2} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
