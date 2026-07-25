'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { WorkerCards } from '@/modules/jobs/components';
import type { JobType } from '@/core/queue';

const mockWorkers = [
  { name: 'default-worker', status: 'idle' as const, version: '1.0.0', queue: ['import', 'export', 'sync'] as JobType[], lastActivity: new Date('2026-07-20T11:30:00') },
  { name: 'pdf-worker', status: 'idle' as const, version: '1.0.0', queue: ['pdf'] as JobType[], lastActivity: new Date('2026-07-20T11:00:00') },
  { name: 'email-worker', status: 'running' as const, version: '1.0.0', queue: ['email'] as JobType[], lastActivity: new Date('2026-07-20T11:45:00') },
  { name: 'image-worker', status: 'stopped' as const, version: '1.0.0', queue: ['image'] as JobType[], lastActivity: new Date('2026-07-19T10:00:00') },
];

export default function WorkersPage() {
  return (
    <CrudPage title="Workers" description="Gerencie os workers de processamento">
      <WorkerCards workers={mockWorkers} />
    </CrudPage>
  );
}
