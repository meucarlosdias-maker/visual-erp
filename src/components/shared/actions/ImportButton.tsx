'use client';

import { Button } from '@/components/ui/button';
import { Upload } from '@/constants/icons';

interface ImportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function ImportButton({
  onClick,
  disabled,
  label = 'Importar',
}: ImportButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      <Upload className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
