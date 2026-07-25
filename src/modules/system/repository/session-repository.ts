import type { UserSession } from '../types';

const mockSessions: UserSession[] = [
  { id: 'sess-001', userId: 'u-000001', userName: 'Administrador', device: 'Desktop', browser: 'Chrome 125', operatingSystem: 'Windows 11', ip: '191.123.45.67', country: 'Brasil', city: 'São Paulo', startedAt: new Date(Date.now() - 7200000), lastActivity: new Date(Date.now() - 600000), finishedAt: null, active: true },
  { id: 'sess-002', userId: 'u-000001', userName: 'Administrador', device: 'Mobile', browser: 'Safari', operatingSystem: 'iOS 18', ip: '191.123.45.68', country: 'Brasil', city: 'São Paulo', startedAt: new Date(Date.now() - 86400000), lastActivity: new Date(Date.now() - 3600000), finishedAt: null, active: true },
  { id: 'sess-003', userId: 'u-000002', userName: 'Carlos', device: 'Desktop', browser: 'Firefox 128', operatingSystem: 'Windows 10', ip: '191.234.56.78', country: 'Brasil', city: 'Rio de Janeiro', startedAt: new Date(Date.now() - 3600000), lastActivity: new Date(Date.now() - 300000), finishedAt: null, active: true },
  { id: 'sess-004', userId: 'u-000003', userName: 'Ana', device: 'Desktop', browser: 'Edge 125', operatingSystem: 'Windows 11', ip: '191.345.67.89', country: 'Brasil', city: 'Belo Horizonte', startedAt: new Date(Date.now() - 1800000), lastActivity: new Date(Date.now() - 120000), finishedAt: null, active: true },
  { id: 'sess-005', userId: 'u-000004', userName: 'Roberto', device: 'Tablet', browser: 'Chrome 124', operatingSystem: 'Android 14', ip: '191.456.78.90', country: 'Brasil', city: 'Curitiba', startedAt: new Date(Date.now() - 43200000), lastActivity: new Date(Date.now() - 43200000), finishedAt: new Date(Date.now() - 36000000), active: false },
];

export class SessionRepository {
  async list(): Promise<UserSession[]> {
    return [...mockSessions].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  async listByUserId(userId: string): Promise<UserSession[]> {
    return mockSessions.filter((s) => s.userId === userId);
  }

  async getById(id: string): Promise<UserSession | null> {
    return mockSessions.find((s) => s.id === id) ?? null;
  }

  async create(data: UserSession): Promise<UserSession> {
    mockSessions.push(data);
    return data;
  }

  async update(id: string, data: Partial<UserSession>): Promise<UserSession> {
    const idx = mockSessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Sessão não encontrada');
    mockSessions[idx] = { ...mockSessions[idx], ...data };
    return mockSessions[idx];
  }

  async revoke(id: string): Promise<void> {
    const idx = mockSessions.findIndex((s) => s.id === id);
    if (idx !== -1) {
      mockSessions[idx] = { ...mockSessions[idx], active: false, finishedAt: new Date() };
    }
  }

  async countActiveByUser(userId: string): Promise<number> {
    return mockSessions.filter((s) => s.userId === userId && s.active).length;
  }
}

export const sessionRepository = new SessionRepository();
