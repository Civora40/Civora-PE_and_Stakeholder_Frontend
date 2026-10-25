import { UserRole } from './index';

export type NotificationSeverity = 'urgent' | 'warning' | 'info' | 'success';

export type NotificationCategory =
  | 'sla'
  | 'submission'
  | 'statutory'
  | 'quality'
  | 'fiduciary'
  | 'integration';

export type NotificationTargetRole = 'project_engineer' | 'read_only_stakeholder';

export type NotificationChannel =
  | 'whatsapp'
  | 'telegram'
  | 'portal'
  | 'regulatory'
  | 'system'
  | 'lab';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isoDate: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  targetRole: NotificationTargetRole;
  isRead: boolean;
  isStarred?: boolean;
  projectId?: string;
  projectName?: string;
  projectCode?: string;
  channel?: NotificationChannel;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    submittalId?: string;
    permitCode?: string;
    hoursRemaining?: number;
    amount?: string;
    sourceSender?: string;
    authority?: string;
    discrepancy?: string;
  };
}
