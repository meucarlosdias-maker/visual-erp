import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal do Cliente - Visual ERP',
  description: 'Acompanhe seus projetos, orçamentos e financeiro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
