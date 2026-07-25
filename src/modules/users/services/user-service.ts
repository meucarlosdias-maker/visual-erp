import type { User, UserInvite, UserUpdate } from '../types';
import { userRepository } from '../repository/user-repository';
import { userSchema, userInviteSchema, userUpdateSchema } from '../schemas/user-schema';
import type { UserRepository } from '../repository/user-repository';
import { BaseService } from '@/lib/service-base';

export class UserService extends BaseService<User, Record<string, unknown>, Record<string, unknown>, UserRepository> {
  constructor() {
    super(userRepository);
  }

  protected entityName = 'Usuário';

  async list(): Promise<User[]> {
    return (this.repository as UserRepository).findAll();
  }

  async invite(data: UserInvite): Promise<User> {
    const parsed = userInviteSchema.parse(data);
    const exists = await (this.repository as UserRepository).getByEmail(parsed.email);
    if (exists) throw new Error('Já existe um usuário com este e-mail');
    return (this.repository as UserRepository).invite(parsed);
  }

  async update(id: string, data: UserUpdate): Promise<User> {
    const parsed = userUpdateSchema.parse(data);
    return (this.repository as UserRepository).update(id, parsed);
  }

  async toggleActive(id: string, current: string): Promise<User> {
    return current === 'active'
      ? (this.repository as UserRepository).deactivate(id)
      : (this.repository as UserRepository).activate(id);
  }

  async validate(data: unknown): Promise<{ valid: boolean; errors?: Record<string, string[]> }> {
    const result = userSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return { valid: false, errors };
    }
    return { valid: true };
  }
}

export const userService = new UserService();
