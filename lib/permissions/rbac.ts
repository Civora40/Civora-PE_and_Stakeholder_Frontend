import { CivoraUser, Permission, UserRole } from '@/types';

/**
 * Baseline Permission Matrix
 *
 * Defines default permissions for each role.
 * Resource-level scoping (such as assigned project checks) is enforced via `can()`.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  platform_admin: [
    'dashboard:read',
    'projects:read',
    'projects:manage',
    'submissions:read',
    'submissions:review',
    'reports:read',
    'reports:manage',
    'reports:release',
    'personnel:read',
    'personnel:manage',
    'performance:read',
    'performance:manage',
    'integrations:manage',
    'policies:manage',
    'users:manage',
    'settings:manage',
  ],
  project_engineer: [
    'dashboard:read',
    'projects:read',
    'projects:manage', // In assigned scope
    'submissions:read',
    'submissions:review',
    'reports:read',
    'reports:manage',
    'reports:release', // Explicit permission only
    'personnel:read',
    'personnel:manage', // In assigned scope (identity verification, task linking)
    'performance:read',
    'performance:manage', // In assigned scope (exception recording, review notes)
  ],
  read_only_stakeholder: [
    'dashboard:read',
    'projects:read',
    'submissions:read',
    'reports:read',
    'performance:read', // Summary reports only
  ],
};

export const ROLE_LABELS: Record<UserRole, { title: string; badge: string; description: string }> = {
  platform_admin: {
    title: 'Platform Administrator',
    badge: 'Admin',
    description: 'Complete administrative oversight, user management, and platform configuration.',
  },
  project_engineer: {
    title: 'Project Engineer',
    badge: 'Engineer',
    description: 'Technical reviews, submittal inspection, and discrepancy verification in assigned projects.',
  },
  read_only_stakeholder: {
    title: 'Read-only Stakeholder',
    badge: 'Stakeholder',
    description: 'Auditing, executive review, and monitoring across authorized project scopes.',
  },
};

export interface PermissionContext {
  projectId?: string;
  isAssignedEngineer?: boolean;
  isDraftOwner?: boolean;
}

/**
 * Central Authorization Helper
 *
 * Deny by default. Evaluates role capability AND resource-level context.
 */
export function can(
  user: CivoraUser | null | undefined,
  permission: Permission,
  context?: PermissionContext
): boolean {
  if (!user || !user.role) {
    return false; // Deny by default
  }

  const rolePerms = ROLE_PERMISSIONS[user.role] || [];
  if (!rolePerms.includes(permission)) {
    return false;
  }

  // Scoped project verification
  if (context?.projectId && user.role !== 'platform_admin') {
    const hasProjectAccess =
      user.assignedProjects.includes('*') ||
      user.assignedProjects.includes(context.projectId);

    if (!hasProjectAccess) {
      return false;
    }
  }

  // Granular rules per role:
  switch (permission) {
    case 'projects:manage':
      if (user.role === 'read_only_stakeholder') return false;
      return true;

    case 'submissions:review':
      if (user.role === 'read_only_stakeholder') return false;
      return true;

    case 'personnel:manage':
      if (user.role === 'read_only_stakeholder') return false;
      return true;

    case 'performance:manage':
      if (user.role === 'read_only_stakeholder') return false;
      return true;

    case 'reports:manage':
      if (user.role === 'read_only_stakeholder') return false;
      return true;

    case 'reports:release':
      // Requires explicit release authority
      if (user.role === 'read_only_stakeholder') return false;
      // Both platform_admin and project_engineer have authorized release credentials in Civora
      return true;

    case 'integrations:manage':
    case 'policies:manage':
    case 'users:manage':
    case 'settings:manage':
      return user.role === 'platform_admin';

    default:
      return true;
  }
}

export interface NavigationItem {
  name: string;
  href: string;
  iconName:
    | 'LayoutDashboard'
    | 'Briefcase'
    | 'Inbox'
    | 'FileText'
    | 'Settings'
    | 'Users2'
    | 'Activity'
    | 'TrendingUp'
    | 'Layers'
    | 'Sliders';
  permission: Permission;
  badge?: string;
}

export const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    permission: 'dashboard:read',
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    iconName: 'Briefcase',
    permission: 'projects:read',
  },
  {
    name: 'Submissions',
    href: '/dashboard/submissions',
    iconName: 'Inbox',
    permission: 'submissions:read',
  },
  {
    name: 'Activity & Tasks',
    href: '/dashboard/activity',
    iconName: 'Activity',
    permission: 'submissions:read',
  },
  {
    name: 'Personnel',
    href: '/dashboard/personnel',
    iconName: 'Users2',
    permission: 'personnel:read',
  },
  {
    name: 'Performance',
    href: '/dashboard/performance',
    iconName: 'TrendingUp',
    permission: 'performance:read',
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    iconName: 'FileText',
    permission: 'reports:read',
  },
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    iconName: 'Layers',
    permission: 'integrations:manage',
  },
  {
    name: 'Reporting Policies',
    href: '/dashboard/reporting-policies',
    iconName: 'Sliders',
    permission: 'policies:manage',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    iconName: 'Settings',
    permission: 'settings:manage',
  },
];

/**
 * Filter navigation items strictly based on user's effective permissions.
 */
export function getNavigationForUser(user: CivoraUser | null): NavigationItem[] {
  if (!user) return [];
  return ALL_NAVIGATION_ITEMS.filter((item) => can(user, item.permission));
}
