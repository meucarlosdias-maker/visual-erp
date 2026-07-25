'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  value: number;
  max: number;
  label?: string;
  loading?: boolean;
  className?: string;
}

export function ProgressCard({ title, value, max, label, loading, className }: ProgressCardProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-muted animate-pulse rounded" />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">{label ?? `${pct}%`}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
