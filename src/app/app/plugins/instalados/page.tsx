'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { PluginTable, PluginForm, PluginFilterBar } from '@/modules/plugins/components';
import { usePlugins, usePluginFilter } from '@/modules/plugins/hooks';
import type { PluginCategory } from '@/core/plugins';

export default function PluginsPage() {
  const router = useRouter();
  const { data, loading, toggle, delete: remove, refetch } = usePlugins();
  const { search, setSearch, category, setCategory, enabled, setEnabled, reset } = usePluginFilter();

  const handleToggle = useCallback(async (id: string) => {
    const result = await toggle(id);
    if (result) {
      toast.success(result.enabled ? 'Plugin ativado' : 'Plugin desativado');
    } else {
      toast.error('Erro ao alterar status do plugin');
    }
  }, [toggle]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Plugin removido');
    else toast.error('Erro ao remover plugin');
  }, [remove]);

  const handleView = useCallback((id: string) => {
    router.push(`/app/plugins/${id}`);
  }, [router]);

  const filtered = data.filter((p) => {
    if (category && (category as string) !== 'all' && p.category !== category) return false;
    if (enabled !== '') {
      const enabledBool = enabled === true;
      if (p.enabled !== enabledBool) return false;
    }
    if (search) {
      const term = search.toLowerCase();
      if (!p.name.toLowerCase().includes(term) && !p.description?.toLowerCase().includes(term)) return false;
    }
    return true;
  });

  return (
    <CrudPage
      title="Plugins Instalados"
      description="Gerencie os plugins instalados no sistema"
      toolbar={<PluginForm onSuccess={refetch} />}
    >
      <PluginFilterBar
        search={search}
        onSearchChange={setSearch}
        category={category as string}
        onCategoryChange={(v) => setCategory(v === 'all' ? '' : v as PluginCategory)}
        enabled={String(enabled)}
        onEnabledChange={(v) => setEnabled(v === 'all' ? '' : v === 'true')}
        onReset={reset}
      />
      <div className="mt-4">
        {loading ? (
          <LoadingLocal message="Carregando plugins..." />
        ) : filtered.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">Nenhum plugin encontrado.</p>
        ) : (
          <PluginTable data={filtered} onToggle={handleToggle} onDelete={handleDelete} onView={handleView} />
        )}
      </div>
    </CrudPage>
  );
}
