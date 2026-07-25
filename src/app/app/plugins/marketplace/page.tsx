'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { MarketplaceCard } from '@/modules/plugins/components';
import { useMarketplace } from '@/modules/plugins/hooks';
import { LifecycleService } from '@/modules/plugins/services';
import type { MarketplaceListingData } from '@/modules/plugins/types';

export default function MarketplacePage() {
  const { listings, loading, refetch } = useMarketplace();

  const handleInstall = useCallback(async (id: string) => {
    const item = listings.find((l) => l.id === id);
    if (!item) return;
    try {
      const slug = item.name.toLowerCase().replace(/\s+/g, '-');
      await LifecycleService.install('company-1', {
        name: item.name,
        slug,
        version: '1.0.0',
        author: item.author,
        description: item.description,
        category: item.category as Parameters<typeof LifecycleService.install>[1]['category'],
        enabled: true,
      });
      toast.success(`Plugin "${item.name}" instalado com sucesso`);
      refetch();
    } catch {
      toast.error(`Erro ao instalar plugin "${item.name}"`);
    }
  }, [listings, refetch]);

  return (
    <CrudPage
      title="Marketplace"
      description="Explore plugins disponíveis para o Visual ERP"
    >
      {loading ? (
        <LoadingLocal message="Carregando marketplace..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((item) => (
            <MarketplaceCard key={item.id} item={item as unknown as MarketplaceListingData} onInstall={handleInstall} />
          ))}
        </div>
      )}
    </CrudPage>
  );
}
