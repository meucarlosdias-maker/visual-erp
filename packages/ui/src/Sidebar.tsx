'use client';

import { createElement } from 'react';

interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  logo?: string;
  companyName?: string;
  onNavigate: (href: string) => void;
}

export function Sidebar({ items, logo, companyName, onNavigate }: SidebarProps) {
  return createElement('div', { className: 'flex flex-col flex-1 bg-white border-r border-gray-200' },
    createElement('div', { className: 'flex items-center gap-2 h-16 px-6 border-b border-gray-200' },
      logo
        ? createElement('img', { src: logo, alt: companyName ?? '', className: 'h-8 w-8' })
        : createElement('div', { className: 'h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm' },
          (companyName ?? 'E')[0]
        ),
      createElement('span', { className: 'font-semibold text-gray-900' }, companyName ?? 'ERP'),
    ),
    createElement('nav', { className: 'flex-1 px-3 py-4 space-y-1 overflow-y-auto' },
      ...items.map((item) =>
        createElement('button', {
          key: item.href,
          onClick: () => onNavigate(item.href),
          className: 'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors',
        }, item.label)
      ),
    ),
  );
}
