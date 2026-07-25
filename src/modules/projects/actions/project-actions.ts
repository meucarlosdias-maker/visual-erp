'use server';

import { projectService } from '../services/project-service';
import { projectTaskService } from '../services/project-task-service';

export async function listProjects() {
  return projectService.list();
}

export async function getProject(id: string) {
  return projectService.get(id);
}

export async function createProject(data: Record<string, unknown>) {
  return projectService.create(data);
}

export async function createProjectFromQuotation(quotationId: string, clientId: string | null, name: string) {
  return projectService.createFromQuotation(quotationId, clientId, name);
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  return projectService.update(id, data);
}

export async function updateProjectStatus(id: string, status: string) {
  return projectService.updateStatus(id, status);
}

export async function deleteProject(id: string) {
  await projectService.delete(id);
}

export async function listProjectTasks(projectId: string) {
  return projectTaskService.listByProjectId(projectId);
}

export async function updateProjectTask(id: string, data: Record<string, unknown>) {
  return projectTaskService.update(id, data);
}

export async function updateProjectTaskStatus(id: string, status: string) {
  return projectTaskService.updateStatus(id, status);
}
