'use client';

import { Button } from '@/components/ui/button';
import { Download } from '@/constants/icons';

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function ExportButton({
  onClick,
  disabled,
  label = 'Exportar',
}: ExportButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
