import { companyNavigation } from './company-navigation';

export const sidebarMenu = companyNavigation;

export const userMenuItems = [
  { label: 'Perfil', href: '/app/configuracoes' },
] as const;

export const publicRoutes = [
  '/auth/login',
  '/auth/recuperar-senha',
  '/auth/atualizar-senha',
  '/auth/callback',
] as const;
