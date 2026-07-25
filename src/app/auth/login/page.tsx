'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/modules/auth/actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, { error: '' });

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Visual ERP</CardTitle>
          <CardDescription>Faça login para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-center text-sm">
              <a
                href="/auth/recuperar-senha"
                className="text-muted-foreground hover:text-foreground underline"
              >
                Esqueceu a senha?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
