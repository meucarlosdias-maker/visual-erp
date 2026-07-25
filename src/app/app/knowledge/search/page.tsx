'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInterface } from '@/modules/knowledge/components';

export default function SearchPage() {
  return (
    <CrudPage
      title="Pesquisar"
      description="Busque documentos na base de conhecimento"
    >
      <SearchInterface />
    </CrudPage>
  );
}
