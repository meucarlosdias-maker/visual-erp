'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Download, Check, Star } from '@/constants/icons';
import type { PluginCategory } from '@/core/plugins';
import type { MarketplaceListingData } from '../types';
import { PluginCategoryBadge } from './PluginCategoryBadge';

export function MarketplaceCard({
  item,
  onInstall,
}: {
  item: MarketplaceListingData;
  onInstall: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{item.name}</CardTitle>
            <CardDescription>v{item.version} · {item.author}</CardDescription>
          </div>
          <PluginCategoryBadge category={item.category as PluginCategory} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            {item.downloads.toLocaleString()}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        {item.installed ? (
          <Button variant="outline" className="w-full" disabled>
            <Check className="h-4 w-4 mr-1" />
            Instalado
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onInstall(item.id)}>
            <Download className="h-4 w-4 mr-1" />
            Instalar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
