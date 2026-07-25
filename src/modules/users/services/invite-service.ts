import { inviteRepository } from '../repository/invite-repository';
import { userRepository } from '../repository/user-repository';
import { userInviteSchema } from '../schemas/user-schema';
import type { Invite, UserInvite } from '../types';
import type { InviteRepository } from '../repository/invite-repository';
import { BaseService } from '@/lib/service-base';

const TOKEN_LENGTH = 48;

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_LENGTH));
  let token = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += chars.charAt(bytes[i] % chars.length);
  }
  return token;
}

function generateExpiryDate(hours = 72): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

export class InviteService extends BaseService<Invite, Record<string, unknown>, Record<string, unknown>, InviteRepository> {
  constructor() {
    super(inviteRepository);
  }

  protected entityName = 'Convite';

  async list(): Promise<Invite[]> {
    return (this.repository as InviteRepository).findAll();
  }

  async create(data: Record<string, unknown>): Promise<Invite> {
    const result = await this.invite(data as unknown as UserInvite);
    const invite = await (this.repository as InviteRepository).getByToken(result.inviteToken);
    if (!invite) throw new Error('Falha ao criar convite');
    return invite;
  }

  async invite(data: UserInvite): Promise<{ inviteToken: string }> {
    const parsed = userInviteSchema.parse(data);

    const existingUser = await userRepository.getByEmail(parsed.email);
    if (existingUser) throw new Error('Já existe um usuário com este e-mail');

    const existingInvite = await inviteRepository.getByEmail(parsed.email);
    if (existingInvite) {
      await inviteRepository.updateStatus(existingInvite.id, 'cancelled');
    }

    const token = generateToken();
    const expiresAt = generateExpiryDate();

    await inviteRepository.create({
      email: parsed.email,
      firstName: parsed.firstName,
      lastName: parsed.lastName ?? '',
      token,
      status: 'pending',
      role: parsed.role,
      companyId: parsed.companyId,
      expiresAt,
    });

    return { inviteToken: token };
  }

  async sendEmail(token: string): Promise<void> {
    const invite = await inviteRepository.getByToken(token);
    if (!invite) throw new Error('Convite não encontrado');
    if (invite.status !== 'pending') throw new Error('Convite não está mais pendente');
    if (new Date() > invite.expiresAt) {
      await inviteRepository.updateStatus(invite.id, 'expired');
      throw new Error('Convite expirado');
    }
  }

  async listByCompany(companyId: string): Promise<Invite[]> {
    return inviteRepository.listByCompany(companyId);
  }
}

export const inviteService = new InviteService();
