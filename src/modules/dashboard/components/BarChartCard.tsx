'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingLocal } from '@/components/feedback';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '../types';
import { cn } from '@/lib/utils';

interface BarChartCardProps {
  title: string;
  data: ChartDataPoint[];
  loading?: boolean;
  className?: string;
  dataKey?: string;
  secondaryKey?: string;
}

export function BarChartCard({ title, data, loading, className, dataKey = 'value', secondaryKey }: BarChartCardProps) {
  if (loading) return <Card className={cn('', className)}><CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent><LoadingLocal /></CardContent></Card>;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip />
              <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              {secondaryKey && <Bar dataKey={secondaryKey} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
