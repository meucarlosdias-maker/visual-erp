'use client';

import { createElement } from 'react';
import { Badge } from './Badge';

interface HeaderProps {
  title: string;
  userName?: string;
  userAvatar?: string | null;
  onLogout?: () => void;
  badge?: string;
}

export function Header({ title, userName, userAvatar, onLogout, badge }: HeaderProps) {
  return createElement('header', { className: 'sticky top-0 z-10 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between' },
    createElement('div', { className: 'flex items-center gap-3' },
      createElement('h1', { className: 'text-xl font-semibold text-gray-900' }, title),
      badge ? createElement(Badge, { variant: 'info' }, badge) : null,
    ),
    createElement('div', { className: 'flex items-center gap-3' },
      userName
        ? createElement('span', { className: 'text-sm text-gray-700' }, userName)
        : null,
      userAvatar
        ? createElement('img', { src: userAvatar, alt: '', className: 'h-8 w-8 rounded-full' })
        : null,
      onLogout
        ? createElement('button', {
            onClick: onLogout,
            className: 'text-sm text-gray-500 hover:text-gray-700',
          }, 'Sair')
        : null,
    ),
  );
}
