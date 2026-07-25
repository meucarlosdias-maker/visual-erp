'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/constants/icons';

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function NextButton({
  onClick,
  disabled,
  label = 'Próximo',
}: NextButtonProps) {
  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
