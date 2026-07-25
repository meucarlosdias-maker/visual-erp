'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Pencil, Trash2 } from '@/constants/icons';
import { useTemplates, updateTemplate, deleteTemplate } from '@/modules/communication';
import type { MessageTemplateRecord } from '@/core/communication';

const categoryLabels: Record<string, string> = {
  commercial: 'Comercial',
  financial: 'Financeiro',
  billing: 'Cobrança',
  production: 'Produção',
  installation: 'Instalação',
  pos_sale: 'Pós-venda',
  support: 'Suporte',
  general: 'Geral',
};

function TemplateCard({ template, onEdit, onDelete }: { template: MessageTemplateRecord; onEdit: (t: MessageTemplateRecord) => void; onDelete: (id: string) => void }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{template.name}</CardTitle>
            <Badge variant="outline" className="text-[10px]">{categoryLabels[template.category]}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(template)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(template.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
        {template.variables && template.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.variables.map((v) => (
              <Badge key={v} variant="secondary" className="text-[10px] font-mono">{v}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TemplatesPage() {
  const { data, loading, refetch } = useTemplates();
  const [search, setSearch] = useState('');

  const filtered = data.filter((t) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return t.name.toLowerCase().includes(term) || t.content.toLowerCase().includes(term);
  });

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
    await refetch();
  };

  const handleEdit = async (template: MessageTemplateRecord) => {
    const name = window.prompt('Novo nome:', template.name);
    if (name && name !== template.name) {
      await updateTemplate(template.id, { name });
      await refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Templates</h1>
          <p className="text-sm text-muted-foreground">Modelos de mensagens para canais de comunicação</p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1" /> Novo Template
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Template</DialogTitle></DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" placeholder="Ex: Orçamento Aprovado" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea id="content" name="content" rows={5} placeholder="Olá {{cliente}}, seu orçamento foi aprovado!" />
              </div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar templates..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhum template encontrado.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard key={template.id} template={template} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
