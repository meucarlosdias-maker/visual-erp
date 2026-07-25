'use client';

import { Badge } from '@/components/ui/badge';
import { X } from '@/constants/icons';

interface FilterTagsProps {
  tags: { label: string; value: string }[];
  onRemove: (value: string) => void;
  onClear: () => void;
}

export function FilterTags({ tags, onRemove, onClear }: FilterTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <Badge key={tag.value} variant="secondary" className="gap-1">
          {tag.label}
          <button
            type="button"
            onClick={() => onRemove(tag.value)}
            className="rounded-full hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
      >
        Limpar todos
      </button>
    </div>
  );
}
