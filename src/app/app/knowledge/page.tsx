'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Search, Settings } from '@/constants/icons';

export default function KnowledgeHubPage() {
  const router = useRouter();

  const cards = [
    { icon: BookOpen, label: 'Coleções', desc: 'Gerencie bases de conhecimento', href: '/app/knowledge/collections' },
    { icon: FileText, label: 'Documentos', desc: 'Documentos indexados por coleção', href: '/app/knowledge/documents' },
    { icon: Search, label: 'Pesquisas', desc: 'Busque na base de conhecimento', href: '/app/knowledge/search' },
    { icon: Settings, label: 'Configurações', desc: 'Configure pipelines e provedores', href: '/app/knowledge/settings' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Conhecimento</h1>
          <p className="text-sm text-muted-foreground">Base de conhecimento corporativo com suporte a RAG</p>
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
