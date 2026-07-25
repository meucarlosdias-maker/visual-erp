import { Inbox } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title = 'Nenhum registro encontrado',
  description = 'Nenhum dado disponível para exibição.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className,
      )}
    >
      {icon ?? <Inbox className="h-12 w-12 text-muted-foreground" />}
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
