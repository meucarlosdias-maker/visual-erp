'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Save } from '@/constants/icons';

interface SaveButtonProps {
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
}

export function SaveButton({
  loading,
  disabled,
  label = 'Salvar',
  onClick,
}: SaveButtonProps) {
  return (
    <Button type={onClick ? 'button' : 'submit'} disabled={disabled || loading} onClick={onClick}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      {loading ? 'Salvando...' : label}
    </Button>
  );
}
