'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEntity } from '@/modules/builder';

export default function NewEntityPage() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const entity = await createEntity(
      'company-1',
      fd.get('name') as string,
      fd.get('slug') as string,
      fd.get('description') as string,
    );
    router.push(`/app/builder/entities/${entity.id}`);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Nova Entidade</h1>
        <p className="text-sm text-muted-foreground">Crie uma nova entidade personalizada</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Dados da Entidade</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" name="name" placeholder="Ex: Visitas Técnicas" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" name="slug" placeholder="Ex: visitas-tecnicas" required pattern="[a-z0-9-]+" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" name="description" placeholder="Descrição da entidade" />
            </div>
            <Button type="submit" className="w-full">Criar Entidade</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
