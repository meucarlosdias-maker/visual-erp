import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal do Colaborador - Visual ERP',
  description: 'Gerencie suas atividades, agenda e produção',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
