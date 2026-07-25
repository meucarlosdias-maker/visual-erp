export const Colors = {
  primary: '#3b82f6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  background: '#ffffff',
  foreground: '#0a0a0a',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  border: '#d1d5db',
  ring: '#3b82f6',
  destructive: '#ef4444',
  destructiveForeground: '#fafafa',
} as const;

export const StatusVariant = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'secondary' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'warning' },
  approved: { bg: 'bg-green-100', text: 'text-green-800', badge: 'success' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', badge: 'info' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', badge: 'success' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', badge: 'destructive' },
} as const;
