'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Phone, Globe } from '@/constants/icons';

export function CompanyCard({
  company,
}: {
  company: { name: string; tradeName: string | null; document: string | null; email: string | null; phone: string | null; timezone: string; language: string; currency: string } | null;
}) {
  if (!company) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{company.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {company.tradeName && <p className="text-muted-foreground">Nome fantasia: {company.tradeName}</p>}
        {company.document && <p className="text-muted-foreground">CNPJ: {company.document}</p>}
        {company.email && (
          <p className="flex items-center gap-1 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> {company.email}
          </p>
        )}
        {company.phone && (
          <p className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" /> {company.phone}
          </p>
        )}
        <p className="flex items-center gap-1 text-muted-foreground">
          <Globe className="h-3.5 w-3.5" />
          {company.timezone} · {company.language} · {company.currency}
        </p>
      </CardContent>
    </Card>
  );
}
