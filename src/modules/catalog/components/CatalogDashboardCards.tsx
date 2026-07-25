'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, ListTree, Package, Puzzle } from '@/constants/icons';
import { useCategories } from '../hooks/use-categories';
import { useSubcategories } from '../hooks/use-subcategories';
import { useServices } from '../hooks/use-services';
import { LoadingLocal } from '@/components/feedback';

export function CatalogDashboardCards() {
  const { categories, loading: loadingCat } = useCategories();
  const { data: subcategories, loading: loadingSub } = useSubcategories();
  const { data: services, loading: loadingSvc } = useServices();

  if (loadingCat || loadingSub || loadingSvc) {
    return <LoadingLocal size={24} message="Carregando catálogo..." />;
  }

  const cards = [
    { title: 'Categorias', value: categories.length, icon: FolderKanban },
    { title: 'Subcategorias', value: subcategories.length, icon: ListTree },
    { title: 'Serviços', value: services.length, icon: Package },
    { title: 'Componentes', value: 0, icon: Puzzle },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
