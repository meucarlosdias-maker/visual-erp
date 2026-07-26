'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/index';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  ChevronRightIcon,
} from '@/constants/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/config/company-navigation';

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = item.href ? pathname === item.href : false;

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        collapsed && 'justify-center px-2',
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const hasActiveChild = item.children?.some((c) => c.href && pathname === c.href);

  if (!item.children?.length) {
    return <NavLink item={item} collapsed={collapsed} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors',
          collapsed && 'justify-center px-2',
          hasActiveChild && 'font-medium',
        )}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </>
        )}
      </button>
      {!collapsed && open && item.children && (
        <div className="ml-4 mt-1 space-y-1 border-l pl-2">
          {item.children.map((child) => (
            <NavLink key={child.label} item={child} collapsed={false} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  navigation: NavItem[];
  logoHref?: string;
}

export function Sidebar({ navigation, logoHref = '/app' }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        {sidebarOpen && (
          <Link href={logoHref} className="font-semibold text-sidebar-foreground">
            Visual ERP
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <NavGroup key={item.label} item={item} collapsed={!sidebarOpen} />
        ))}
      </nav>
    </aside>
  );
}
