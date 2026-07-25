'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, Webhook, FileText, FileText as DocsIcon } from '@/constants/icons';

export default function IntegracoesPage() {
  const router = useRouter();

  const cards = [
    { icon: Hash, label: 'API Keys', desc: 'Gerencie chaves de API para integrações', href: '/app/integracoes/api' },
    { icon: Webhook, label: 'Webhooks', desc: 'Configure disparos de eventos HTTP', href: '/app/integracoes/webhooks' },
    { icon: FileText, label: 'Logs', desc: 'Visualize o histórico de chamadas à API', href: '/app/integracoes/logs' },
    { icon: DocsIcon, label: 'Documentação', desc: 'Consulte a documentação dos endpoints', href: '/app/integracoes/docs' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Webhook className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Integrações</h1>
          <p className="text-sm text-muted-foreground">Gerencie APIs, webhooks e integrações do sistema</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Card key={card.href} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => router.push(card.href)}>
            <CardHeader className="flex flex-row items-center gap-3">
              <card.icon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-lg">{card.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}