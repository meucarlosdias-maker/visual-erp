'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from '@/constants/icons';
import type { TenantPlanInfo } from '@/core/tenant';

export function PlanCard({
  plan,
  current,
  onSelect,
}: {
  plan: TenantPlanInfo;
  current: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className={current ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {current && <Badge>Atual</Badge>}
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-2">
          <span className="text-2xl font-bold">
            {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Até {plan.usersLimit === 999999 ? '∞' : plan.usersLimit} usuários
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Até {plan.clientsLimit === 99999 ? '∞' : plan.clientsLimit} clientes
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.activeProjectsLimit === 999999 ? '∞' : plan.activeProjectsLimit} projetos ativos
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.storageLimit >= 1024 ? `${plan.storageLimit / 1024}GB` : `${plan.storageLimit}MB`} armazenamento
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.integrationsLimit === 999 ? '∞' : plan.integrationsLimit} integrações
          </li>
          {plan.aiLimit && (
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              IA inclusa
            </li>
          )}
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            {plan.pluginsLimit === 999 ? '∞' : plan.pluginsLimit} plugins
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        {current ? (
          <Button variant="outline" className="w-full" disabled>
            Plano atual
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onSelect(plan.id)}>
            Selecionar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
