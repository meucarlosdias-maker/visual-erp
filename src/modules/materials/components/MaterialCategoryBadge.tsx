'use client';

import { Badge } from '@/components/ui/badge';

export function MaterialCategoryBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? 'default' : 'secondary'}>
      {active ? 'Ativo' : 'Inativo'}
    </Badge>
  );
}
