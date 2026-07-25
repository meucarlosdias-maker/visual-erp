'use client';

export function UsageBar({ label, used, limit, unit }: { label: string; used: number; limit: number; unit?: string }) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const color = percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span>{used}{unit ?? ''} / {limit === 999999 ? '∞' : `${limit}${unit ?? ''}`}</span>
      </div>
      {limit !== 999999 && (
        <div className="w-full bg-secondary rounded-full h-2">
          <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${percentage}%` }} />
        </div>
      )}
    </div>
  );
}
