import { FileX } from '@/constants/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NotFoundProps {
  title?: string;
  description?: string;
  className?: string;
}

export function NotFound({
  title = 'Página não encontrada',
  description = 'O recurso que você procura não existe ou foi removido.',
  className,
}: NotFoundProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className,
      )}
    >
      <FileX className="h-12 w-12 text-muted-foreground" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      <Link href="/app">
        <Button variant="outline" className="mt-2">Voltar ao Dashboard</Button>
      </Link>
    </div>
  );
}
