'use client';

import { useActionState } from 'react';

interface AuthFormProps {
  action: (prevState: { error: string } | undefined, formData: FormData) => Promise<{ error: string } | undefined>;
  pendingLabel?: string;
  submitLabel?: string;
}

export function AuthForm({ action, pendingLabel = 'Entrando...', submitLabel = 'Entrar' }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">E-mail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}