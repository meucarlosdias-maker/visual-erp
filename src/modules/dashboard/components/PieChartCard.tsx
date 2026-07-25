'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingLocal } from '@/components/feedback';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '../types';
import { cn } from '@/lib/utils';

const DEFAULT_COLORS = ['hsl(var(--primary))', '#fbbf24', '#a78bfa', '#34d399', '#f87171', '#60a5fa', '#f472b6', '#34d399'];

interface PieChartCardProps {
  title: string;
  data: ChartDataPoint[];
  loading?: boolean;
  className?: string;
}

export function PieChartCard({ title, data, loading, className }: PieChartCardProps) {
  if (loading) return <Card className={cn('', className)}><CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent><LoadingLocal /></CardContent></Card>;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                label={({ name, value }: { name?: string; value: number }) => `${name ?? ''}: ${value}`}
              >
                {data.map((entry, idx) => (
                  <Cell key={entry.label} fill={entry.color ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
