import type { SystemLog } from '../types';

const mockLogs: SystemLog[] = [
  { id: 'log-001', level: 'INFO', module: 'system', message: 'Sistema iniciado com sucesso', stack: '', createdAt: new Date(Date.now() - 86400000) },
  { id: 'log-002', level: 'INFO', module: 'auth', message: 'Usuário admin fez login', stack: '', createdAt: new Date(Date.now() - 7200000) },
  { id: 'log-003', level: 'WARN', module: 'database', message: 'Consulta lenta detectada em work_orders (2.3s)', stack: '', createdAt: new Date(Date.now() - 3600000) },
  { id: 'log-004', level: 'ERROR', module: 'storage', message: 'Falha ao fazer upload - tamanho excede limite', stack: 'Error: File too large\n  at uploadService (storage.ts:45)', createdAt: new Date(Date.now() - 1800000) },
  { id: 'log-005', level: 'INFO', module: 'email', message: 'E-mail de recuperação enviado para user@email.com', stack: '', createdAt: new Date(Date.now() - 600000) },
  { id: 'log-006', level: 'FATAL', module: 'database', message: 'Conexão com banco de dados perdida', stack: 'Error: Connection refused\n  at Database.connect (db.ts:22)', createdAt: new Date(Date.now() - 300000) },
  { id: 'log-007', level: 'WARN', module: 'api', message: 'Tentativa de acesso sem permissão: /api/admin', stack: '', createdAt: new Date(Date.now() - 120000) },
  { id: 'log-008', level: 'INFO', module: 'auth', message: 'Sessão encerrada - usuário admin', stack: '', createdAt: new Date(Date.now() - 90000) },
  { id: 'log-009', level: 'ERROR', module: 'api', message: 'Timeout na requisição - /api/financeiro/report', stack: 'Error: Request timeout\n  at fetch (api.ts:102)', createdAt: new Date(Date.now() - 60000) },
  { id: 'log-010', level: 'WARN', module: 'auth', message: 'Tentativa de login inválida - usuário desconhecido', stack: '', createdAt: new Date(Date.now() - 30000) },
];

export class LogRepository {
  async list(): Promise<SystemLog[]> {
    return [...mockLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(data: SystemLog): Promise<SystemLog> {
    mockLogs.unshift(data);
    return data;
  }

  async purgeBefore(date: Date): Promise<void> {
    const toRemove = mockLogs.filter((l) => l.createdAt < date);
    for (const l of toRemove) {
      const idx = mockLogs.indexOf(l);
      if (idx !== -1) mockLogs.splice(idx, 1);
    }
  }
}

export const logRepository = new LogRepository();
