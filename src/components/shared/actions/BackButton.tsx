'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from '@/constants/icons';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href, label = 'Voltar' }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => (href ? router.push(href) : router.back())}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
