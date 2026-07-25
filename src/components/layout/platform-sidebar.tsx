'use client';

import { Sidebar } from './sidebar';
import { platformNavigation } from '@/config/platform-navigation';

export function PlatformSidebar() {
  return <Sidebar navigation={platformNavigation} logoHref="/platform" />;
}
