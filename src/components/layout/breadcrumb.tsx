'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from '@/constants/icons';

const labelMap: Record<string, string> = {
  '': 'Dashboard',
  clientes: 'Clientes',
  projetos: 'Projetos',
  producao: 'Produção',
  financeiro: 'Financeiro',
  configuracoes: 'Configurações',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.replace('/app', '').split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link href="/app" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = '/app/' + segments.slice(0, index + 1).join('/');
        const label = labelMap[segment] ?? segment;
        const isLast = index === segments.length - 1;

        return (
          <span key={segment} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
