'use client';

import { createElement } from 'react';

interface PortalLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header: React.ReactNode;
}

export function PortalLayout({ children, sidebar, header }: PortalLayoutProps) {
  return createElement('div', { className: 'min-h-screen bg-gray-50 flex' },
    createElement('div', { className: 'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0' },
      sidebar,
    ),
    createElement('div', { className: 'lg:pl-64 flex flex-col flex-1' },
      header,
      createElement('main', { className: 'flex-1 p-6' }, children),
    ),
  );
}
