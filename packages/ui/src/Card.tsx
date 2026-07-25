'use client';

import { createElement } from 'react';

interface CardProps { children: React.ReactNode; className?: string; }
interface CardSectionProps { children: React.ReactNode; className?: string; }

export function Card({ children, className = '' }: CardProps) {
  return createElement('div', { className: `bg-white rounded-xl border border-gray-200 shadow-sm ${className}` }, children);
}

export function CardHeader({ children, className = '' }: CardSectionProps) {
  return createElement('div', { className: `px-6 py-4 border-b border-gray-100 ${className}` }, children);
}

export function CardContent({ children, className = '' }: CardSectionProps) {
  return createElement('div', { className: `px-6 py-4 ${className}` }, children);
}

export function CardFooter({ children, className = '' }: CardSectionProps) {
  return createElement('div', { className: `px-6 py-4 border-t border-gray-100 ${className}` }, children);
}

export function CardTitle({ children, className = '' }: CardSectionProps) {
  return createElement('h3', { className: `text-lg font-semibold text-gray-900 ${className}` }, children);
}

export function CardDescription({ children, className = '' }: CardSectionProps) {
  return createElement('p', { className: `text-sm text-gray-500 ${className}` }, children);
}
