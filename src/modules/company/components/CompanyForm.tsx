'use client';

import { useState, useCallback } from 'react';
import { toast } from '@/components/feedback/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { LoadingLocal } from '@/components/feedback';
import { CompanyAddress } from './CompanyAddress';
import { CompanyContacts } from './CompanyContacts';
import { CompanyBanking } from './CompanyBanking';
import { CompanyBusinessHours } from './CompanyBusinessHours';
import { CompanyBranding } from './CompanyBranding';
import { CompanySettingsPanel } from './CompanySettingsPanel';
import { CnpjField } from './CnpjField';
import { CepField } from './CepField';
import type { Company } from '../types';

interface CompanyFormProps {
  company: Company;
  onSave: (data: Company) => Promise<boolean>;
  onUploadLogo: (file: File) => void;
  onUploadFavicon: (file: File) => void;
}

export function CompanyForm({ company, onSave, onUploadLogo, onUploadFavicon }: CompanyFormProps) {
  const [data, setData] = useState<Company>(company);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const markDirty = useCallback(() => setDirty(true), []);

  const handleChange = (field: string, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleSubmit = async () => {
    setSaving(true);
    const ok = await onSave(data);
    setSaving(false);
    if (ok) {
      setDirty(false);
      toast.success('Empresa salva com sucesso!');
    }
  };

  if (!data) return <LoadingLocal size={24} message="Carregando empresa..." />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{data.nomeFantasia}</h2>
          <p className="text-sm text-muted-foreground">{data.razaoSocial} · {data.cnpj}</p>
        </div>
      </div>

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="endereco">Endereço</TabsTrigger>
          <TabsTrigger value="branding">Identidade Visual</TabsTrigger>
          <TabsTrigger value="bancario">Bancário</TabsTrigger>
          <TabsTrigger value="horarios">Funcionamento</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="razaoSocial">Razão Social</Label>
              <Input id="razaoSocial" value={data.razaoSocial} onChange={(e) => handleChange('razaoSocial', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input id="nomeFantasia" value={data.nomeFantasia} onChange={(e) => handleChange('nomeFantasia', e.target.value)} />
            </div>
            <CnpjField value={data.cnpj} onChange={(v) => handleChange('cnpj', v)} />
            <div>
              <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
              <Input id="inscricaoEstadual" value={data.inscricaoEstadual} onChange={(e) => handleChange('inscricaoEstadual', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
              <Input id="inscricaoMunicipal" value={data.inscricaoMunicipal} onChange={(e) => handleChange('inscricaoMunicipal', e.target.value)} />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Switch id="isActive" checked={data.isActive} onCheckedChange={(v) => handleChange('isActive', v)} />
                <Label htmlFor="isActive">Empresa ativa</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contatos" className="mt-4">
          <CompanyContacts
            telefone={data.telefone} celular={data.celular}
            email={data.email} site={data.site} whatsapp={data.whatsapp}
            onChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="endereco" className="mt-4">
          <div className="space-y-4">
            <CepField cep={data.cep} onChange={handleChange} />
            <CompanyAddress
              cep={data.cep} logradouro={data.logradouro}
              numero={data.numero} complemento={data.complemento}
              bairro={data.bairro} cidade={data.cidade}
              estado={data.estado} pais={data.pais}
              onChange={handleChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="branding" className="mt-4">
          <CompanyBranding
            logoUrl={data.logoUrl} faviconUrl={data.faviconUrl}
            corPrimaria={data.corPrimaria} corSecundaria={data.corSecundaria}
            nomeFantasia={data.nomeFantasia}
            onLogoUpload={onUploadLogo} onFaviconUpload={onUploadFavicon}
            onChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="bancario" className="mt-4">
          <CompanyBanking
            banco={data.banco} agencia={data.agencia}
            conta={data.conta} pix={data.pix} favorecido={data.favorecido}
            onChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="horarios" className="mt-4">
          <CompanyBusinessHours
            horarioInicio={data.horarioInicio} horarioFim={data.horarioFim}
            trabalhaSabado={data.trabalhaSabado} trabalhaDomingo={data.trabalhaDomingo}
            onChange={handleChange}
          />
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <CompanySettingsPanel
            moeda={data.moeda} idioma={data.idioma}
            timezone={data.timezone} formatoData={data.formatoData}
            onChange={handleChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2 pt-4 border-t">
        <SaveButton onClick={handleSubmit} loading={saving} disabled={!dirty} />
        <CancelButton onClick={() => { setData(company); setDirty(false); }} disabled={saving} />
      </div>
    </div>
  );
}
