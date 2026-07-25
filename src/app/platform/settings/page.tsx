'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlatformSettingsPage() {
  return (
    <CrudPage title="Configurações da Plataforma" description="Configurações globais do Visual ERP">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Configurações Gerais</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Nome da Plataforma: Visual ERP</p>
            <p>Versão: 2.5.0</p>
            <p>Ambiente: Produção</p>
            <p>Região: Brasil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Limites Globais</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Máx. Empresas: Ilimitado</p>
            <p>Máx. Usuários por Empresa: 999.999</p>
            <p>Storage Máximo por Empresa: 999.999 MB</p>
            <p>Timeout de Sessão: 60 minutos</p>
          </CardContent>
        </Card>
      </div>
    </CrudPage>
  );
}
