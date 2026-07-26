import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CreditCard,
  DollarSign,
  MessageSquare,
  ShoppingBag,
  Puzzle,
  GitBranch,
  RotateCcw,
  ToggleLeft,
  Play,
  Activity,
  History,
  BarChart3,
  List,
  Save,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Lock,
  ShieldX,
  Settings,
  Mail,
  Brain,
  Hash,
  Inbox,
  BookOpen,
  Star,
  Search,
  Globe,
  Bell,
  Webhook,
  Layers,
  Database,
  File,
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
      { href: '/platform/users', label: 'Usuários da Plataforma', icon: Users },
      { href: '/platform/plans', label: 'Planos', icon: FileText },
      { href: '/platform/subscriptions', label: 'Assinaturas', icon: CreditCard },
      { href: '/platform/billing', label: 'Cobranças', icon: DollarSign },
      { href: '/platform/tickets', label: 'Tickets', icon: MessageSquare },
    ],
  },
  {
    label: 'Operacional',
    icon: Layers,
    children: [
      { href: '/platform/marketplace', label: 'Marketplace', icon: ShoppingBag },
      { href: '/platform/extensions', label: 'Extensões', icon: Puzzle },
      { href: '/platform/integrations', label: 'Integrações', icon: GitBranch },
      { href: '/platform/updates', label: 'Atualizações', icon: RotateCcw },
      { href: '/platform/feature-flags', label: 'Feature Flags', icon: ToggleLeft },
      { href: '/platform/jobs', label: 'Jobs', icon: Play },
    ],
  },
  {
    label: 'Monitoramento',
    icon: Activity,
    children: [
      { href: '/platform/health', label: 'Saúde da Plataforma', icon: Activity },
      { href: '/platform/logs', label: 'Logs', icon: FileText },
      { href: '/platform/audit', label: 'Auditoria', icon: History },
      { href: '/platform/performance', label: 'Performance', icon: BarChart3 },
      { href: '/platform/queues', label: 'Filas', icon: List },
      { href: '/platform/backups', label: 'Backup', icon: Save },
    ],
  },
  {
    label: 'Financeiro',
    icon: DollarSign,
    children: [
      { href: '/platform/mrr', label: 'Receita MRR', icon: TrendingUp },
      { href: '/platform/subscriptions', label: 'Assinaturas', icon: CreditCard },
      { href: '/platform/defaults', label: 'Inadimplência', icon: AlertTriangle },
      { href: '/platform/payments', label: 'Pagamentos', icon: DollarSign },
      { href: '/platform/reports', label: 'Relatórios', icon: BarChart3 },
    ],
  },
  {
    label: 'Segurança',
    icon: ShieldCheck,
    children: [
      { href: '/platform/rbac', label: 'RBAC', icon: ShieldCheck },
      { href: '/platform/sessions', label: 'Sessões', icon: UserCheck },
      { href: '/platform/api-keys', label: 'API Keys', icon: Lock },
      { href: '/platform/oauth', label: 'OAuth', icon: Globe },
      { href: '/platform/security-audit', label: 'Auditoria de Segurança', icon: ShieldX },
    ],
  },
  {
    label: 'Configurações',
    icon: Settings,
    children: [
      { href: '/platform/settings', label: 'Plataforma', icon: Settings },
      { href: '/platform/templates', label: 'Templates', icon: File },
      { href: '/platform/ai-settings', label: 'IA', icon: Brain },
      { href: '/platform/email', label: 'E-mail', icon: Mail },
      { href: '/platform/communication', label: 'Comunicação', icon: Bell },
      { href: '/platform/variables', label: 'Variáveis', icon: Hash },
    ],
  },
  {
    label: 'Suporte',
    icon: MessageSquare,
    children: [
      { href: '/platform/chamados', label: 'Chamados', icon: Inbox },
      { href: '/platform/knowledge-base', label: 'Base de Conhecimento', icon: BookOpen },
      { href: '/platform/feedback', label: 'Feedback', icon: Star },
      { href: '/platform/help', label: 'Central de Ajuda', icon: Search },
    ],
  },
];
