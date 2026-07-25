'use client';

import { Button } from '@/components/ui/button';
import { CheckCheck } from '@/constants/icons';

interface FinishButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

export function FinishButton({
  onClick,
  disabled,
  loading,
  label = 'Finalizar',
}: FinishButtonProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled || loading}>
      <CheckCheck className="mr-2 h-4 w-4" />
      {loading ? 'Finalizando...' : label}
    </Button>
  );
}
