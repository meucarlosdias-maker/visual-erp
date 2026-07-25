'use client';

import { Button } from '@/components/ui/button';
import { Copy } from '@/constants/icons';

interface DuplicateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function DuplicateButton({
  onClick,
  disabled,
  label = 'Duplicar',
}: DuplicateButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      <Copy className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
