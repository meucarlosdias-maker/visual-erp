'use client';

import { useRouter } from 'next/navigation';
import { CrudPage } from '@/components/shared/CrudPage';
import { InstallationForm } from '@/modules/installations/components/InstallationForm';
import { installationService } from '@/modules/installations/services/installation-service';
import { projectService } from '@/modules/projects/services/project-service';
import { toast } from '@/components/feedback';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { Project } from '@/modules/projects/types';

export default function NovaInstalacaoPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    projectService.list().then(setProjects).catch(() => {});
  }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    if (!selectedProject) { toast.error('Selecione um projeto'); return false; }
    const project = projects.find((p) => p.id === selectedProject);
    if (!project) { toast.error('Projeto não encontrado'); return false; }
    try {
      const installation = await installationService.createFromProject(selectedProject, project.clientId, project.name);
      if (data.address || data.city || data.contactName) {
        await installationService.update(installation.id, data);
      }
      toast.success('Instalação criada com sucesso');
      router.push('/app/instalacoes');
      return true;
    } catch {
      toast.error('Erro ao criar instalação');
      return false;
    }
  };

  return (
    <CrudPage title="Nova Instalação" description="Crie uma nova instalação a partir de um projeto">
      <div className="space-y-2 mb-6">
        <Label htmlFor="project">Projeto</Label>
        <Select value={selectedProject} onValueChange={(v) => setSelectedProject(v || '')}>
          <SelectTrigger><SelectValue placeholder="Selecione um projeto..." /></SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.number} — {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <InstallationForm onSave={handleSave} onCancel={() => router.back()} />
    </CrudPage>
  );
}
