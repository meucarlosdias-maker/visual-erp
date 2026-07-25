'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/feedback';
import { Home, User, FileText, CheckCheck } from '@/constants/icons';
import { useCompany } from '../hooks/use-company';
import { formatDate } from '@/utils/helpers';

export function CompanyCard() {
  const { company, loading } = useCompany();

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Empresa</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  if (!company) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Empresa</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhuma empresa cadastrada.</p>
        </CardContent>
      </Card>
    );
  }

  const initials = company.nomeFantasia
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={company.logoUrl} alt={company.nomeFantasia} />
          <AvatarFallback className="rounded-lg text-sm">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <CardTitle className="text-sm truncate">{company.nomeFantasia}</CardTitle>
          <p className="text-xs text-muted-foreground truncate">{company.razaoSocial}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{company.cnpj}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Home className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{company.cidade} · {company.estado}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Admin</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCheck className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{formatDate(company.updatedAt)}</span>
        </div>
        <Badge variant={company.isActive ? 'default' : 'secondary'} className="mt-1">
          {company.isActive ? 'Ativa' : 'Inativa'}
        </Badge>
      </CardContent>
    </Card>
  );
}
