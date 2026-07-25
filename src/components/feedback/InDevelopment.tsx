import { Construction } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface InDevelopmentProps {
  title?: string;
  description?: string;
  className?: string;
}

export function InDevelopment({
  title = 'Em desenvolvimento',
  description = 'Esta funcionalidade ainda está sendo implementada.',
  className,
}: InDevelopmentProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className,
      )}
    >
      <Construction className="h-12 w-12 text-muted-foreground" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
