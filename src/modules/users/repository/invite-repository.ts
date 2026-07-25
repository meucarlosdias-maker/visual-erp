import type { Invite } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const mockInvites: Invite[] = [];

export class InviteRepository extends BaseRepository<Invite, Omit<Invite, 'id' | 'createdAt'>, Partial<Invite>> {
  async findAll(): Promise<Invite[]> {
    return [...mockInvites];
  }

  async findById(id: string): Promise<Invite | null> {
    return mockInvites.find((i) => i.id === id) ?? null;
  }

  async findMany(filter: Partial<Invite>): Promise<Invite[]> {
    return mockInvites.filter((i) =>
      Object.entries(filter).every(([key, value]) => i[key as keyof Invite] === value)
    );
  }

  async listByCompany(companyId: string): Promise<Invite[]> {
    return mockInvites.filter((i) => i.companyId === companyId);
  }

  async getByToken(token: string): Promise<Invite | null> {
    return mockInvites.find((i) => i.token === token) ?? null;
  }

  async getByEmail(email: string): Promise<Invite | null> {
    return mockInvites.find((i) => i.email === email && i.status === 'pending') ?? null;
  }

  async create(data: Omit<Invite, 'id' | 'createdAt'>): Promise<Invite> {
    const invite: Invite = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    mockInvites.push(invite);
    return invite;
  }

  async update(id: string, data: Partial<Invite>): Promise<Invite> {
    const index = mockInvites.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Convite não encontrado');
    mockInvites[index] = { ...mockInvites[index], ...data };
    return mockInvites[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = mockInvites.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Convite não encontrado');
    mockInvites.splice(index, 1);
    return true;
  }

  async restore(id: string): Promise<Invite> {
    const index = mockInvites.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Convite não encontrado');
    return mockInvites[index];
  }

  async updateStatus(id: string, status: Invite['status']): Promise<Invite> {
    const index = mockInvites.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Convite não encontrado');
    mockInvites[index] = { ...mockInvites[index], status };
    return mockInvites[index];
  }
}

export const inviteRepository = new InviteRepository();
