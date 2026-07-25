import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'h-4 w-full',
        variant === 'rectangular' && 'h-20 w-full',
        className,
      )}
      style={{ width, height }}
    />
  );
}
