import { NavigationSection } from './types';
import { CivoraUser } from '../../types';
import { can } from '../permissions/rbac';

export const WORKSPACE_NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: 'overview',
    name: 'Overview',
    iconName: 'LayoutDashboard',
    permission: 'dashboard:read',
    items: [
      {
        id: 'project-dashboard',
        name: 'Project Dashboard',
        href: '/dashboard',
        permission: 'dashboard:read',
      },
      {
        id: 'all-projects',
        name: 'All Projects',
        href: '/dashboard/overview/projects',
        permission: 'projects:read',
      },
      {
        id: 'project-activity',
        name: 'Project Activity',
        href: '/dashboard/activity',
        permission: 'dashboard:read',
      },
      {
        id: 'key-metrics',
        name: 'Key Metrics',
        href: '/dashboard/performance',
        permission: 'performance:read',
      },
      {
        id: 'notifications',
        name: 'Notifications & Alerts',
        href: '/dashboard/notifications',
        permission: 'dashboard:read',
        countKey: 'unreadAlerts',
        badgeVariant: 'rose',
      },
    ],
  },
  {
    id: 'submissions',
    name: 'Field Submissions',
    iconName: 'Inbox',
    permission: 'submissions:read',
    items: [
      {
        id: 'all-submissions',
        name: 'All Submissions',
        href: '/dashboard/submissions',
        permission: 'submissions:read',
      },
      {
        id: 'pending-review',
        name: 'Pending Review',
        href: '/dashboard/submissions/pending',
        permission: 'submissions:read',
        countKey: 'pendingSubmissions',
        badgeVariant: 'teal',
      },
      {
        id: 'by-profession',
        name: 'By Profession',
        href: '/dashboard/submissions/profession',
        permission: 'submissions:read',
      },
      {
        id: 'attachments-media',
        name: 'Attachments & Media',
        href: '/dashboard/submissions/attachments',
        permission: 'submissions:read',
      },
    ],
  },
  {
    id: 'projects',
    name: 'Project Control',
    iconName: 'Briefcase',
    permission: 'projects:read',
    items: [
      {
        id: 'projects-directory',
        name: 'Projects Directory',
        href: '/dashboard/projects',
        permission: 'projects:read',
      },
      {
        id: 'new-project',
        name: 'New Project',
        href: '/dashboard/projects/new',
        permission: 'projects:manage',
      },
      {
        id: 'tasks-actions',
        name: 'Tasks & Actions',
        href: '/dashboard/projects/tasks',
        permission: 'projects:read',
      },
      {
        id: 'project-milestones',
        name: 'Milestones',
        href: '/dashboard/projects/milestones',
        permission: 'projects:read',
      },
    ],
  },
  {
    id: 'reports',
    name: 'Quality & Reports',
    iconName: 'FileText',
    permission: 'reports:read',
    items: [
      {
        id: 'all-reports',
        name: 'All Reports',
        href: '/dashboard/reports',
        permission: 'reports:read',
      },
      {
        id: 'approval-queue',
        name: 'Approval Queue',
        href: '/dashboard/reports/approvals',
        permission: 'reports:read',
        countKey: 'pendingReports',
        badgeVariant: 'blue',
      },
      {
        id: 'published-reports',
        name: 'Published Reports',
        href: '/dashboard/reports/published',
        permission: 'reports:read',
      },
    ],
  },
  {
    id: 'people',
    name: 'People & Compliance',
    iconName: 'Users2',
    permission: 'personnel:read',
    items: [
      {
        id: 'team-directory',
        name: 'Team Directory',
        href: '/dashboard/personnel',
        permission: 'personnel:read',
      },
      {
        id: 'reporting-compliance',
        name: 'Reporting Compliance',
        href: '/dashboard/performance/compliance',
        permission: 'performance:read',
      },
      {
        id: 'cadres-departments',
        name: 'Departments & Cadres',
        href: '/dashboard/personnel/departments',
        permission: 'personnel:read',
      },
    ],
  },
  {
    id: 'reviews',
    name: 'Reviews & Approvals',
    iconName: 'CheckSquare',
    permission: 'submissions:review',
    allowedRoles: ['project_engineer'],
    items: [
      {
        id: 'submission-reviews',
        name: 'Submission Reviews',
        href: '/dashboard/reviews/submissions',
        permission: 'submissions:review',
        allowedRoles: ['project_engineer'],
      },
      {
        id: 'report-approvals',
        name: 'Report Approvals',
        href: '/dashboard/reviews/reports',
        permission: 'reports:release',
        allowedRoles: ['project_engineer'],
      },
    ],
  },
  {
    id: 'stakeholder',
    name: 'Stakeholder Oversight',
    iconName: 'Shield',
    permission: 'dashboard:read',
    allowedRoles: ['read_only_stakeholder'],
    items: [
      {
        id: 'stakeholder-executive',
        name: 'Executive Portfolio',
        href: '/dashboard/stakeholder',
        permission: 'dashboard:read',
        allowedRoles: ['read_only_stakeholder'],
      },
      {
        id: 'stakeholder-capital-projects',
        name: 'Capital Projects Audit',
        href: '/dashboard/stakeholder/projects',
        permission: 'projects:read',
        allowedRoles: ['read_only_stakeholder'],
      },
      {
        id: 'stakeholder-compliance',
        name: 'Statutory Compliance',
        href: '/dashboard/stakeholder/compliance',
        permission: 'performance:read',
        allowedRoles: ['read_only_stakeholder'],
      },
      {
        id: 'stakeholder-reports',
        name: 'Inspection Sign-Offs',
        href: '/dashboard/stakeholder/reports',
        permission: 'reports:read',
        allowedRoles: ['read_only_stakeholder'],
      },
    ],
  },
];

export const STAKEHOLDER_NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: 'stakeholder',
    name: 'Stakeholder Workspace',
    iconName: 'Shield',
    permission: 'dashboard:read',
    items: [
      {
        id: 'overview',
        name: 'Overview',
        href: '/dashboard',
        permission: 'dashboard:read',
      },
      {
        id: 'my-projects',
        name: 'My Projects',
        href: '/dashboard/projects',
        permission: 'projects:read',
      },
      {
        id: 'released-reports',
        name: 'Released Reports',
        href: '/dashboard/reports',
        permission: 'reports:read',
      },
      {
        id: 'notifications',
        name: 'Notifications',
        href: '/dashboard/notifications',
        permission: 'dashboard:read',
        countKey: 'unreadAlerts',
        badgeVariant: 'rose',
      },
    ],
  },
];

/**
 * Filter sections and sub-items based on user's authorized role & permissions.
 */
export function getWorkspaceNavigation(user: CivoraUser | null): NavigationSection[] {
  if (!user) return [];

  const sourceSections =
    user.role === 'read_only_stakeholder'
      ? STAKEHOLDER_NAVIGATION_SECTIONS
      : WORKSPACE_NAVIGATION_SECTIONS;

  return sourceSections
    .map((section) => {
      // If section restricts to specific roles and user does not have an allowed role, skip it
      if (section.allowedRoles && !section.allowedRoles.includes(user.role)) {
        return null;
      }

      // If section requires permission user does not have, skip it
      if (section.permission && !can(user, section.permission)) {
        return null;
      }

      // Filter sub-items to only authorized links
      const authorizedItems = section.items.filter((item) => {
        if (item.allowedRoles && !item.allowedRoles.includes(user.role)) {
          return false;
        }
        return can(user, item.permission);
      });

      if (authorizedItems.length === 0) {
        return null;
      }

      return {
        ...section,
        items: authorizedItems,
      };
    })
    .filter((section): section is NavigationSection => section !== null);
}
