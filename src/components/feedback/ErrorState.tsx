import { AlertCircle } from '@/constants/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Erro ao carregar',
  description = 'Ocorreu um erro inesperado. Tente novamente.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className,
      )}
    >
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-2">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
