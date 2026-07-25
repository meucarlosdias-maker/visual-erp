'use client';

import { Button } from '@/components/ui/button';
import { X } from '@/constants/icons';

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function CancelButton({
  onClick,
  disabled,
  label = 'Cancelar',
}: CancelButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      <X className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
