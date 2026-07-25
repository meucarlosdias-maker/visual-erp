'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function KnowledgeSettingsPage() {
  const pipelines = [
    { name: 'Upload', status: 'Pronto', desc: 'Upload de arquivos PDF, DOCX, XLSX, TXT, Markdown' },
    { name: 'Extração', status: 'Estrutura pronta', desc: 'Extração de texto dos documentos (sem OCR)' },
    { name: 'Chunking', status: 'Implementado', desc: 'Estratégias: fixo, parágrafo, sentença, markdown, híbrido' },
    { name: 'Embeddings', status: 'Interface pronta', desc: 'OpenAI, Gemini, Anthropic, Local (não ativo)' },
    { name: 'Indexação', status: 'Estrutura pronta', desc: 'Armazenamento de chunks e embeddings' },
    { name: 'Busca', status: 'Estrutura pronta', desc: 'Full-text, vetorial, híbrida (sem banco vetorial)' },
  ];

  return (
    <CrudPage
      title="Configurações"
      description="Pipeline de indexação e provedores da base de conhecimento"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pipelines.map((p) => (
          <Card key={p.name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{p.name}</CardTitle>
              <Badge variant="outline">{p.status}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </CrudPage>
  );
}
