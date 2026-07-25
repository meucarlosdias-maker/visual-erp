import type { AnnouncementDefinition, AnnouncementType } from '../types';

const announcements: AnnouncementDefinition[] = [
  { id: 'ann-001', title: 'Manutenção Programada', message: 'O sistema estará indisponível no domingo das 02h às 04h para atualização.', type: 'maintenance', startsAt: new Date('2026-07-27T02:00:00'), endsAt: new Date('2026-07-27T04:00:00'), active: true, createdAt: new Date('2026-07-20') },
  { id: 'ann-002', title: 'Nova Versão 2.5 disponível', message: 'Confira as novidades da versão 2.5: novo módulo de compliance, melhorias no dashboard e correções de segurança.', type: 'update', startsAt: null, endsAt: null, active: true, createdAt: new Date('2026-07-18') },
  { id: 'ann-003', title: 'Promoção Plano Professional', message: '20% de desconto no plano anual Professional. Válido até 31/07.', type: 'info', startsAt: new Date('2026-07-01'), endsAt: new Date('2026-07-31'), active: true, createdAt: new Date('2026-07-01') },
];

export function createAnnouncement(input: Omit<AnnouncementDefinition, 'id' | 'createdAt'>): AnnouncementDefinition {
  const entry: AnnouncementDefinition = { ...input, id: crypto.randomUUID(), createdAt: new Date() };
  announcements.push(entry); return entry;
}
export function updateAnnouncement(id: string, updates: Partial<Omit<AnnouncementDefinition, 'id' | 'createdAt'>>): AnnouncementDefinition | undefined {
  const idx = announcements.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  announcements[idx] = { ...announcements[idx], ...updates };
  return announcements[idx];
}
export function deleteAnnouncement(id: string): boolean {
  const idx = announcements.findIndex((a) => a.id === id);
  if (idx !== -1) { announcements.splice(idx, 1); return true; }
  return false;
}
export function getAnnouncement(id: string): AnnouncementDefinition | undefined { return announcements.find((a) => a.id === id); }
export function listAnnouncements(filter?: { type?: AnnouncementType; active?: boolean }): AnnouncementDefinition[] {
  let result = [...announcements];
  if (filter?.type) result = result.filter((a) => a.type === filter.type);
  if (filter?.active !== undefined) result = result.filter((a) => a.active === filter.active);
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
export function getActiveAnnouncements(): AnnouncementDefinition[] {
  const now = new Date();
  return announcements.filter((a) => a.active && (!a.startsAt || a.startsAt <= now) && (!a.endsAt || a.endsAt >= now));
}
