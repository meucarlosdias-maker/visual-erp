'use client';
import { PermissionsMatrix } from '@/modules/system/components/PermissionsMatrix';
import { FileText } from '@/constants/icons';

export default function PermissoesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Permissões</h1>
          <p className="text-sm text-muted-foreground">Matriz de permissões por papel</p>
        </div>
      </div>
      <PermissionsMatrix />
    </div>
  );
}
