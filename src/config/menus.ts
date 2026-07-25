import { mainNavigation } from './navigation';

export const sidebarMenu = mainNavigation;

export const userMenuItems = [
  { label: 'Perfil', href: '/app/configuracoes' },
] as const;

export const publicRoutes = [
  '/auth/login',
  '/auth/recuperar-senha',
  '/auth/atualizar-senha',
  '/auth/callback',
] as const;
