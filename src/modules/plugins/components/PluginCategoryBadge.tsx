'use client';

import type { PluginCategory } from '@/core/plugins';

const categoryLabels: Record<PluginCategory, string> = {
  integration: 'Integração',
  analytics: 'Analytics',
  automation: 'Automação',
  ui: 'Interface',
  report: 'Relatório',
  other: 'Outro',
};

const categoryColors: Record<PluginCategory, string> = {
  integration: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  analytics: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  automation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ui: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  report: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export function PluginCategoryBadge({ category }: { category: PluginCategory }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] ?? categoryColors.other}`}>
      {categoryLabels[category] ?? category}
    </span>
  );
}

export { categoryLabels, categoryColors };
