'use client';

import { FileText } from '@/constants/icons';

export default function FiscalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Fiscal</h1>
          <p className="text-sm text-muted-foreground">Gestão fiscal e tributária</p>
        </div>
      </div>
    </div>
  );
}
