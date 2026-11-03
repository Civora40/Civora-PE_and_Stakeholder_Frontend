import { NotificationItem } from '@/types/notifications';
import { UserRole } from '@/types';

/**
 * Production Clean State Notifications
 * All seed notifications cleared to zero.
 */

export const ENGINEER_NOTIFICATIONS: NotificationItem[] = [];

export const STAKEHOLDER_NOTIFICATIONS: NotificationItem[] = [];

export function getNotificationsForRole(role: UserRole): NotificationItem[] {
  if (role === 'read_only_stakeholder') {
    return STAKEHOLDER_NOTIFICATIONS;
  }
  return ENGINEER_NOTIFICATIONS;
}

export const DEMO_NOTIFICATIONS: NotificationItem[] = [];
