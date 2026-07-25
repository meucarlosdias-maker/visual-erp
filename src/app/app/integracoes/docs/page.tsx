'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { ApiDocs } from '@/modules/api/components';

export default function ApiDocsPage() {
  return (
    <CrudPage
      title="Documentação da API"
      description="Consulte os endpoints disponíveis para integração"
    >
      <ApiDocs />
    </CrudPage>
  );
}