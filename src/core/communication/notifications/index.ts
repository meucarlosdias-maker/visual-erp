import type { NotificationRecord, NotificationType, NotificationFilter } from '../types';

const notifications: NotificationRecord[] = [];

export const NotificationEngine = {
  async create(data: Omit<NotificationRecord, 'id' | 'createdAt' | 'read'>): Promise<NotificationRecord> {
    const record: NotificationRecord = {
      ...data,
      id: `notif-${crypto.randomUUID().slice(0, 8)}`,
      read: false,
      createdAt: new Date(),
    };
    notifications.push(record);
    return record;
  },

  async findByCompany(companyId: string, filter?: NotificationFilter): Promise<NotificationRecord[]> {
    let result = notifications.filter((n) => n.companyId === companyId);

    if (filter) {
      if (filter.type) result = result.filter((n) => n.type === filter.type);
      if (filter.read !== undefined) result = result.filter((n) => n.read === filter.read);
      if (filter.userId) result = result.filter((n) => n.userId === filter.userId);
    }

    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return result;
  },

  async findByUser(userId: string, filter?: Omit<NotificationFilter, 'userId'>): Promise<NotificationRecord[]> {
    return NotificationEngine.findByCompany('', { ...filter, userId });
  },

  async markAsRead(id: string): Promise<NotificationRecord | null> {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return null;
    notifications[index] = { ...notifications[index], read: true };
    return notifications[index];
  },

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].userId === userId && !notifications[i].read) {
        notifications[i] = { ...notifications[i], read: true };
        count++;
      }
    }
    return count;
  },

  async countUnread(userId: string): Promise<number> {
    return notifications.filter((n) => n.userId === userId && !n.read).length;
  },

  async delete(id: string): Promise<boolean> {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;
    notifications.splice(index, 1);
    return true;
  },

  _getAll(): NotificationRecord[] {
    return notifications;
  },
};
