import { UserRole } from './enums';

export const RoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrador',
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.MANAGER]: 'Gerente',
  [UserRole.TEAM_MEMBER]: 'Membro da Equipe',
  [UserRole.VIEWER]: 'Visualizador',
};

export const RoleDescriptions: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Acesso total ao sistema',
  [UserRole.ADMIN]: 'Acesso administrativo por empresa',
  [UserRole.MANAGER]: 'Gerencia projetos e equipe',
  [UserRole.TEAM_MEMBER]: 'Executa tarefas nos projetos',
  [UserRole.VIEWER]: 'Acesso apenas para leitura',
};

export const RoleHierarchy: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.ADMIN]: 80,
  [UserRole.MANAGER]: 60,
  [UserRole.TEAM_MEMBER]: 40,
  [UserRole.VIEWER]: 20,
};
