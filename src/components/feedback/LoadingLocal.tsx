import { Loader2 } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface LoadingLocalProps {
  size?: number;
  message?: string;
  className?: string;
}

export function LoadingLocal({ size = 16, message, className }: LoadingLocalProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Loader2
        className="animate-spin text-muted-foreground"
        style={{ width: size, height: size }}
      />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </span>
  );
}
