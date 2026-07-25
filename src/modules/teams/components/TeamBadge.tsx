'use client';

import { Badge } from '@/components/ui/badge';

export function TeamBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? 'default' : 'secondary'}>
      {active ? 'Ativa' : 'Inativa'}
    </Badge>
  );
}
