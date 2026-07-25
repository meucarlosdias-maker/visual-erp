import { InstallationAgenda } from '@/modules/installations/components/InstallationAgenda';

export const metadata = {
  title: 'Agenda de Instalações | Visual ERP',
};

export default function AgendaPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agenda</h1>
        <p className="text-sm text-muted-foreground">Visualize e gerencie o cronograma de instalações</p>
      </div>
      <InstallationAgenda />
    </div>
  );
}
