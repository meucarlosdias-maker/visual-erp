import type { User, UserInvite } from '../types';
import { BaseRepository } from '@/lib/repository-base';

const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

const mockUsers: User[] = [
  {
    id: 'u-000001',
    companyId: '00000000-0000-0000-0000-000000000000',
    firstName: 'Administrador',
    lastName: 'Sistema',
    email: 'admin@visualerp.com.br',
    telefone: '(11) 99999-0001',
    position: 'CTO',
    role: 'SUPER_ADMIN',
    roleId: null,
    status: 'active',
    lastLogin: new Date(),
    emailVerified: true,
    avatarUrl: '',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-06-15'),
    deletedAt: null,
    createdBy: null,
    updatedBy: null,
    deletedBy: null,
  },
  {
    id: 'u-000002',
    companyId: '00000000-0000-0000-0000-000000000000',
    firstName: 'Carlos',
    lastName: 'Gerente',
    email: 'gerente@visualerp.com.br',
    telefone: '(11) 99999-0002',
    position: 'Gerente de Projetos',
    role: 'MANAGER',
    roleId: null,
    status: 'active',
    lastLogin: new Date('2025-06-10'),
    emailVerified: true,
    avatarUrl: '',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-05-20'),
    deletedAt: null,
    createdBy: 'u-000001',
    updatedBy: 'u-000001',
    deletedBy: null,
  },
  {
    id: 'u-000003',
    companyId: '00000000-0000-0000-0000-000000000000',
    firstName: 'Ana',
    lastName: 'Membro',
    email: 'membro@visualerp.com.br',
    telefone: '(11) 99999-0003',
    position: 'Designer',
    role: 'TEAM_MEMBER',
    roleId: null,
    status: 'inactive',
    lastLogin: null,
    emailVerified: false,
    avatarUrl: '',
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-04-01'),
    deletedAt: null,
    createdBy: 'u-000001',
    updatedBy: 'u-000001',
    deletedBy: null,
  },
];

export class UserRepository extends BaseRepository<User, User, Partial<User>> {
  async findAll(): Promise<User[]> {
    return mockUsers.filter((u) => u.companyId === COMPANY_ID && !u.deletedAt);
  }

  async findById(id: string): Promise<User | null> {
    return mockUsers.find((u) => u.id === id && !u.deletedAt) ?? null;
  }

  async findMany(filter: Partial<User>): Promise<User[]> {
    return mockUsers.filter((u) =>
      Object.entries(filter).every(([key, value]) => u[key as keyof User] === value)
    );
  }

  async getByEmail(email: string): Promise<User | null> {
    return mockUsers.find((u) => u.email === email && !u.deletedAt) ?? null;
  }

  async create(data: User): Promise<User> {
    const user: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(user);
    return user;
  }

  async invite(data: UserInvite): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      companyId: data.companyId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      telefone: data.telefone ?? '',
      position: data.position ?? '',
      role: data.role,
      roleId: null,
      status: 'active',
      lastLogin: null,
      emailVerified: false,
      avatarUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
    };
    mockUsers.push(user);
    return user;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date() };
    return mockUsers[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    mockUsers[index] = { ...mockUsers[index], deletedAt: new Date(), updatedAt: new Date() };
    return true;
  }

  async restore(id: string): Promise<User> {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Usuário não encontrado');
    mockUsers[index] = { ...mockUsers[index], deletedAt: null, updatedAt: new Date() };
    return mockUsers[index];
  }

  async activate(id: string): Promise<User> {
    return this.update(id, { status: 'active' });
  }

  async deactivate(id: string): Promise<User> {
    return this.update(id, { status: 'inactive' });
  }
}

export const userRepository = new UserRepository();
