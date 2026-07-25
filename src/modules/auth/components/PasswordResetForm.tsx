'use client';

import { useActionState } from 'react';

interface PasswordResetFormProps {
  action: (prevState: { error: string } | { success: boolean } | undefined, formData: FormData) => Promise<{ error: string } | { success: boolean } | undefined>;
}

export function PasswordResetForm({ action }: PasswordResetFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const hasSuccess = state !== undefined && 'success' in state && state.success === true;
  const hasError = state !== undefined && 'error' in state && typeof state.error === 'string';

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
      {hasSuccess && (
        <p className="text-sm text-green-600">Link de recuperação enviado!</p>
      )}
      {hasError && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? 'Enviando...' : 'Recuperar Senha'}
      </button>
    </form>
  );
}