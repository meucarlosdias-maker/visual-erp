'use client';

import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from '@/constants/icons';

interface DeleteButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  variant?: 'default' | 'outline';
}

export function DeleteButton({
  onClick,
  loading,
  disabled,
  label = 'Excluir',
  variant = 'outline',
}: DeleteButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className="text-destructive hover:text-destructive"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      {loading ? 'Excluindo...' : label}
    </Button>
  );
}
