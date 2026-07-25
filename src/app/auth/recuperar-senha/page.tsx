'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPassword } from '@/modules/auth/actions';

export default function RecuperarSenhaPage() {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Recuperar Senha</CardTitle>
          <CardDescription>
            Enviaremos um link de recuperação para seu e-mail
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.success ? (
            <p className="text-sm text-green-600 text-center">
              Link de recuperação enviado! Verifique seu e-mail.
            </p>
          ) : (
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
              {state?.error && (
                <p className="text-sm text-destructive">{state.error}</p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? 'Enviando...' : 'Enviar link'}
              </Button>
              <div className="text-center text-sm">
                <a
                  href="/auth/login"
                  className="text-muted-foreground hover:text-foreground underline"
                >
                  Voltar ao login
                </a>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
