'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, BarChart3, DollarSign, Clock } from '@/constants/icons';
import { LoadingLocal } from '@/components/feedback';
import { CompanyDataForm } from '@/modules/company/components/CompanyDataForm';
import { CompanyAddressForm } from '@/modules/company/components/CompanyAddressForm';
import { useCompanySettings } from '@/modules/company/hooks/use-company-settings';

export default function EmpresaPage() {
  const { settings, loading, save } = useCompanySettings();

  if (loading) return <LoadingLocal message="Carregando..." />;
  if (!settings) return <p className="text-center py-12 text-muted-foreground">Erro ao carregar.</p>;

  const cards = [
    { icon: Building2, label: 'Empresa', value: settings.tradeName, color: 'text-blue-600' },
    { icon: BarChart3, label: 'Idioma', value: settings.language, color: 'text-purple-600' },
    { icon: DollarSign, label: 'Moeda', value: settings.currency, color: 'text-green-600' },
    { icon: Clock, label: 'Última Atualização', value: new Date(settings.updatedAt).toLocaleString('pt-BR'), color: 'text-orange-600' },
  ];

  return (
    <CrudPage title="Empresa" description="Configure os dados gerais da empresa">
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {cards.map((c) => (
          <Card key={c.label} className="p-0 shadow-none border-none">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><c.icon className={`h-5 w-5 ${c.color}`} />{c.label}</CardTitle></CardHeader>
            <CardContent><p className="text-lg font-bold truncate">{c.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="data">
        <TabsList>
          <TabsTrigger value="data">Dados da Empresa</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
        </TabsList>
        <TabsContent value="data" className="mt-6">
          <CompanyDataForm settings={settings} onSave={save} />
        </TabsContent>
        <TabsContent value="address" className="mt-6">
          <CompanyAddressForm settings={settings} onSave={save} />
        </TabsContent>
      </Tabs>
    </CrudPage>
  );
}
