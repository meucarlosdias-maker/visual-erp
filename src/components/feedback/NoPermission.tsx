import { ShieldX } from '@/constants/icons';
import { cn } from '@/lib/utils';

interface NoPermissionProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NoPermission({
  title = 'Sem permissão',
  description = 'Você não tem permissão para acessar esta funcionalidade.',
  className,
}: NoPermissionProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className,
      )}
    >
      <ShieldX className="h-12 w-12 text-muted-foreground" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
