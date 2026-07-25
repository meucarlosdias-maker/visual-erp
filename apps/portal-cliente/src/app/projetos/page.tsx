'use client';

import { createAuthProvider, useAuth } from '@visual-erp/auth';
import { withAuth } from '@visual-erp/auth';
import { apiBaseUrl } from '@visual-erp/config';
import { PortalLayout, Sidebar, Header, Card, CardContent } from '@visual-erp/ui';
import { useRouter } from 'next/navigation';

const AuthProvider = createAuthProvider(apiBaseUrl);

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Meus Projetos', href: '/projetos' },
  { label: 'Meus Orçamentos', href: '/orcamentos' },
  { label: 'Financeiro', href: '/financeiro' },
  { label: 'Meu Perfil', href: '/perfil' },
];

function ProjetosContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const projetos = [
    { id: '1', number: 'P-001', name: 'Projeto Exemplo', status: 'IN_PRODUCTION' },
  ];

  return (
    <PortalLayout
      sidebar={<Sidebar items={navItems} companyName="Visual ERP" onNavigate={(href) => router.push(href)} />}
      header={<Header title="Meus Projetos" userName={user?.name} onLogout={logout} />}
    >
      {projetos.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Nenhum projeto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projetos.map((p) => (
            <Card key={p.id}>
              <CardContent>
                <p className="font-medium">{p.number} - {p.name}</p>
                <p className="text-sm text-gray-500">{p.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

const Authenticated = withAuth(ProjetosContent);

export default function ProjetosPage() {
  return (
    <AuthProvider>
      <Authenticated />
    </AuthProvider>
  );
}
