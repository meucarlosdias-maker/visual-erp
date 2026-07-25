'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { CompanyRegionalForm } from '@/modules/company/components/CompanyRegionalForm';
import { CompanyAutomationForm } from '@/modules/company/components/CompanyAutomationForm';
import { useCompanySettings, useCompanyPreferences } from '@/modules/company/hooks/use-company-settings';

export default function PreferenciasPage() {
  const { settings, loading: loadingSettings, save: saveSettings } = useCompanySettings();
  const { preferences, loading: loadingPrefs, save: savePrefs } = useCompanyPreferences();

  if (loadingSettings || loadingPrefs) return <LoadingLocal message="Carregando..." />;
  if (!settings || !preferences) return <p className="text-center py-12 text-muted-foreground">Erro ao carregar.</p>;

  return (
    <CrudPage title="Preferências" description="Configure as preferências regionais e automações do sistema">
      <Tabs defaultValue="regional">
        <TabsList>
          <TabsTrigger value="regional">Preferências</TabsTrigger>
          <TabsTrigger value="automations">Automações</TabsTrigger>
        </TabsList>
        <TabsContent value="regional" className="mt-6">
          <CompanyRegionalForm settings={settings} onSave={saveSettings} />
        </TabsContent>
        <TabsContent value="automations" className="mt-6">
          <CompanyAutomationForm preferences={preferences} onSave={savePrefs} />
        </TabsContent>
      </Tabs>
    </CrudPage>
  );
}
