'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Layers, Layout, Database, FileText } from '@/constants/icons';

const cards = [
  { href: '/app/builder/entities', label: 'Entidades', description: 'Crie e gerencie entidades personalizadas', icon: Layers, color: '#3b82f6' },
  { href: '/app/builder/entities', label: 'Campos', description: 'Defina campos e tipos para suas entidades', icon: FileText, color: '#10b981' },
  { href: '/app/builder/layouts', label: 'Layouts', description: 'Crie layouts visuais para formulários', icon: Layout, color: '#f59e0b' },
  { href: '/app/builder/entities', label: 'Registros', description: 'Visualize dados registrados nas entidades', icon: Database, color: '#8b5cf6' },
];

export default function BuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Visual Builder</h1>
        <p className="text-sm text-muted-foreground">Plataforma de configuração No-Code</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.color, opacity: 0.15 }}>
                  <c.icon className="h-5 w-5" style={{ color: c.color }} />
                </div>
                <CardTitle className="text-sm mt-2">{c.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{c.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tipos de Campo Suportados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {['Texto', 'Número', 'Moeda', 'Telefone', 'CPF/CNPJ', 'Email', 'Senha', 'Textarea', 'Data', 'Hora', 'Data/Hora', 'Select', 'MultiSelect', 'Checkbox', 'Switch', 'Arquivo', 'Imagem', 'Assinatura', 'Relacionamento'].map((t) => (
                <span key={t} className="bg-muted px-2 py-1 rounded text-center">{t}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Validações Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Obrigatório', 'Valor mínimo', 'Valor máximo', 'Regex', 'Email', 'URL', 'CPF', 'CNPJ', 'Telefone', 'Data', 'Arquivo', 'Imagem'].map((v) => (
                <span key={v} className="bg-muted px-2 py-1 rounded text-center">{v}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
