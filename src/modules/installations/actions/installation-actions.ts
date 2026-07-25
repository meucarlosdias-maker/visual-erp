'use server';

import { installationService } from '../services/installation-service';

export async function listInstallations() {
  return installationService.list();
}

export async function getInstallation(id: string) {
  return installationService.getById(id);
}

export async function createInstallationFromProject(projectId: string, clientId: string | null, name: string) {
  return installationService.createFromProject(projectId, clientId, name);
}

export async function updateInstallation(id: string, data: Record<string, unknown>) {
  return installationService.update(id, data);
}

export async function updateInstallationStatus(id: string, status: string) {
  return installationService.updateStatus(id, status);
}

export async function deleteInstallation(id: string) {
  await installationService.delete(id);
}
