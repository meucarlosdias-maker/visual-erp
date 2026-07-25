import {
  LayoutDashboard,
  Building2,
  FileText,
  CreditCard,
  Users,
  BarChart3,
  Bell,
  Settings,
  ShoppingBag,
  Webhook,
  Puzzle,
  ShieldX,
  Activity,
  History,
  AlertCircle,
} from '@/constants/icons';
import type { LucideIcon } from '@/constants/icons';

export interface NavItem {
  href?: string;
  label: string;
  icon: LucideIcon;
  children?: NavItem[];
}

export const platformNavigation: NavItem[] = [
  { href: '/platform', label: 'Dashboard', icon: LayoutDashboard },
  {
    label: 'Gestão',
    icon: Building2,
    children: [
      { href: '/platform/companies', label: 'Empresas', icon: Building2 },
      { href: '/platform/plans', label: 'Planos', icon: FileText },
      { href: '/platform/licenses', label: 'Licenças', icon: CreditCard },
      { href: '/platform/users', label: 'Usuários', icon: Users },
    ],
  },
  {
    label: 'Operacional',
    icon: Activity,
    children: [
      { href: '/platform/metrics', label: 'Métricas', icon: BarChart3 },
      { href: '/platform/announcements', label: 'Avisos', icon: Bell },
      { href: '/platform/settings', label: 'Configurações', icon: Settings },
    ],
  },
  {
    label: 'Extensões',
    icon: Puzzle,
    children: [
      { href: '/app/plugins/marketplace', label: 'Marketplace', icon: ShoppingBag },
    ],
  },
  {
    label: 'Integrações',
    icon: Webhook,
    children: [
      { href: '/app/integracoes/api', label: 'API Keys', icon: ShieldX },
      { href: '/app/integracoes/webhooks', label: 'Webhooks', icon: Webhook },
      { href: '/app/integracoes/logs', label: 'Logs', icon: Activity },
    ],
  },
  {
    label: 'Monitoramento',
    icon: Activity,
    children: [
      { href: '/app/system/health', label: 'Health', icon: Activity },
      { href: '/app/system/logs', label: 'Logs', icon: AlertCircle },
      { href: '/app/system/backups', label: 'Backups', icon: History },
    ],
  },
];
