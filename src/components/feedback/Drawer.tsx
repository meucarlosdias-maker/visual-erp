'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  size?: 'sm' | 'default' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  default: 'max-w-md',
  lg: 'max-w-lg',
};

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  size = 'default',
}: DrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={sizeClasses[size]}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription>{description}</SheetDescription>
          )}
        </SheetHeader>
        <div className="mt-6 space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
