'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, FileText, Settings, History } from '@/constants/icons';

export default function AiHubPage() {
  const router = useRouter();

  const cards = [
    { icon: Bot, label: 'Assistente', desc: 'Converse com a IA do Visual ERP', href: '/app/ai/chat' },
    { icon: Sparkles, label: 'Conversas', desc: 'Gerencie conversas com a IA', href: '/app/ai/chat' },
    { icon: FileText, label: 'Prompts', desc: 'Biblioteca de prompts por módulo', href: '/app/ai/prompts' },
    { icon: Settings, label: 'Provedores', desc: 'Configure provedores de IA', href: '/app/ai/providers' },
    { icon: History, label: 'Histórico', desc: 'Histórico de execuções de IA', href: '/app/ai/history' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Inteligência Artificial</h1>
          <p className="text-sm text-muted-foreground">Assistente inteligente, prompts e provedores de IA</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
