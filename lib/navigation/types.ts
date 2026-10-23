import { Permission, UserRole } from '../../types';

export interface NavigationSubItem {
  id: string;
  name: string;
  href: string;
  permission: Permission;
  badge?: string;
  badgeVariant?: 'teal' | 'blue' | 'rose' | 'emerald' | 'slate';
  countKey?: 'pendingSubmissions' | 'unverifiedSenders' | 'pendingReports' | 'openTasks';
  allowedRoles?: UserRole[];
}

export interface NavigationSection {
  id: string;
  name: string;
  iconName:
    | 'LayoutDashboard'
    | 'Inbox'
    | 'Briefcase'
    | 'FileText'
    | 'Users2'
    | 'CheckSquare'
    | 'FolderArchive'
    | 'Sliders'
    | 'Shield'
    | 'Activity';
  permission?: Permission; // If set, user must have permission to see section
  allowedRoles?: UserRole[]; // If set, user must have one of the allowed roles
  items: NavigationSubItem[]; // Max 4-5 items per section
}

