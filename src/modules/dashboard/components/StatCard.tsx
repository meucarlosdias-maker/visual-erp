'use client';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function StatCard({ title, value, delta, deltaLabel, icon, loading, className }: StatCardProps) {
  const DeltaIcon = delta != null ? (delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : null) : null;
  const deltaColor = delta != null ? (delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-muted-foreground') : '';

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            {delta != null && (
              <div className="flex items-center gap-1">
                {DeltaIcon && <DeltaIcon className={cn('h-4 w-4', deltaColor)} />}
                <span className={cn('text-sm font-medium', deltaColor)}>
                  {delta > 0 ? '+' : ''}{delta}
                </span>
                {deltaLabel && <span className="text-xs text-muted-foreground">{deltaLabel}</span>}
              </div>
            )}
          </div>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
