'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ProjectTask } from '../types';
import { projectTaskService } from '../services/project-task-service';
import { projectService } from '../services/project-service';

interface TaskWithProject extends ProjectTask {
  projectName?: string;
  projectNumber?: string;
}

export function useDepartmentTasks(departmentId: string | null) {
  const [data, setData] = useState<TaskWithProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const refresh = useCallback(async () => {
    if (!departmentId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [tasks, allProjects] = await Promise.all([
        projectTaskService.listByDepartmentAll(departmentId),
        projectService.list(),
      ]);
      if (!mountedRef.current) return;
      const projectMap = new Map(allProjects.map((p) => [p.id, p]));
      const enriched = tasks.map((t) => {
        const proj = projectMap.get(t.projectId);
        return { ...t, projectName: proj?.name, projectNumber: proj?.number };
      });
      setData(enriched);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(async (taskId: string, status: string): Promise<boolean> => {
    try {
      await projectTaskService.updateStatus(taskId, status);
      await refresh();
      return true;
    } catch {
      return false;
    }
  }, [refresh]);

  return { data, loading, error, updateStatus };
}