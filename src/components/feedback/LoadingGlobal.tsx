'use client';

import { useLoadingStore } from '@/stores/loading-store';
import { Loader2 } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface LoadingGlobalProps {
  message?: string;
}

export function LoadingGlobal({ message = 'Carregando...' }: LoadingGlobalProps) {
  const global = useLoadingStore((s) => s.global);

  if (!global) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
