'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { CatalogDashboardCards } from '@/modules/catalog/components/CatalogDashboardCards';

export default function CatalogoDashboardPage() {
  return (
    <CrudPage
      title="Catálogo de Serviços"
      description="Visão geral do catálogo de serviços"
      summary={<CatalogDashboardCards />}
    >
      <p className="text-sm text-muted-foreground">
        Selecione uma das opções no menu lateral para gerenciar categorias, subcategorias ou serviços.
      </p>
    </CrudPage>
  );
}
