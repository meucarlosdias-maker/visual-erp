import { CheckCircle2 } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface SuccessStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({
  title = 'Operação concluída',
  description = 'A ação foi realizada com sucesso.',
  action,
  className,
}: SuccessStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className,
      )}
    >
      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
