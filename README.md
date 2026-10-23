# Civora — Engineering Field Operations & Platform Control Plane

Civora is an enterprise construction reporting, submittal inspection, and statutory project-control platform tailored for civil engineering operations.

---

## 1. Project Architecture & Folder Conventions

Civora uses a **feature-first Next.js App Router architecture**:

```text
frontend/
├── app/                           # Next.js App Router URLs, layouts, and route handlers
│   ├── (auth)/                    # Public authentication pages (login, register, forgot-password)
│   ├── dashboard/                 # Standard Project Workspace
│   │   ├── layout.tsx             # Standard Dashboard Shell with AppSidebar & AppHeader
│   │   ├── page.tsx               # Project Dashboard Overview
│   │   ├── activity/page.tsx      # Project Activity & Event Stream
│   │   ├── performance/           # Key Metrics & Compliance Drill-downs
│   │   ├── submissions/           # Intake Inbox, Pending Review, Profession, Attachments
│   │   ├── projects/              # Projects Directory, Tasks, Milestones
│   │   ├── reports/               # Quality Reports, Approvals Queue, Published
│   │   ├── personnel/             # Team Directory, Cadres & Departments
│   │   ├── reviews/               # Engineer Technical Review & Report Release
│   │   └── settings/              # User Account Settings & Profile
│   └── api/                       # REST API route handlers & webhooks
├── components/                    # Cross-cutting, genuinely reusable UI components
│   ├── layout/                    # AppSidebar, AppHeader, PageHeader, DashboardShell
│   ├── ui/                        # Button, Badge, CustomSelect, EmptyState, etc.
│   ├── modals/                    # Reusable dialogs (LinkTaskModal, RequestInfoModal, etc.)
│   ├── drawers/                   # Reusable side drawers (SubmissionDetailDrawer)
│   ├── forms/                     # Form components
│   └── brand/                     # Official Civora SVG branding and geometric motifs
├── features/                      # Feature-owned UI and business logic
│   ├── dashboard/components/      # CivoraDashboard
│   ├── submissions/components/    # SubmissionsInbox
│   ├── projects/components/       # ProjectsDirectory
│   ├── reports/components/        # ReportsManagement
│   ├── performance/components/    # PerformanceDashboard
│   ├── policies/components/       # ReportingPolicies
│   ├── personnel/components/      # PersonnelDirectory
│   ├── activity/components/       # ActivityTasks
│   └── settings/components/       # UserSettings
├── lib/
│   ├── auth/                      # Session management, cookies, and mock adapters
│   ├── navigation/                # Central navigation configs (workspace)
│   │   ├── types.ts               # Navigation section and item interfaces
│   │   └── workspace-navigation.ts# Grouped, collapsible workspace navigation
│   ├── permissions/               # Central RBAC matrix (`can()` helper)
│   ├── services/                  # Ingestion and compliance calculation services
│   └── mock-data/                 # Deterministic testing fixtures
└── types/                         # TypeScript interfaces (CivoraUser, Submission, etc.)
```

### Component Naming Conventions
- **No `View` suffix anywhere in component or file names.**
  - Use `CivoraDashboard.tsx`, `SubmissionTable.tsx`, `PerformanceDashboard.tsx`, `PersonnelDirectory.tsx`.
- **Thin route pages**: Route files in `app/` strictly compose feature components and handle server-side authorization checks.
- **Admin Console Decoupled**: The platform-wide administrative console is maintained as a separate, dedicated project and has been removed from this project workspace.

---

## 2. Navigation Architecture

### Workspace Navigation (`lib/navigation/workspace-navigation.ts`)
Organized into collapsible, permission-aware sections with **a maximum of 4–5 sub-links per section**:

1. **Overview**
   - Project Dashboard (`/dashboard`)
   - Project Activity (`/dashboard/activity`)
   - Key Metrics (`/dashboard/performance`)
2. **Field Submissions**
   - All Submissions (`/dashboard/submissions`)
   - Pending Review (`/dashboard/submissions/pending`)
   - By Profession (`/dashboard/submissions/profession`)
   - Attachments & Media (`/dashboard/submissions/attachments`)
3. **Project Control**
   - Projects Directory (`/dashboard/projects`)
   - Tasks & Actions (`/dashboard/projects/tasks`)
   - Milestones (`/dashboard/projects/milestones`)
4. **Quality & Reports**
   - All Reports (`/dashboard/reports`)
   - Approval Queue (`/dashboard/reports/approvals`)
   - Published Reports (`/dashboard/reports/published`)
5. **People & Compliance**
   - Team Directory (`/dashboard/personnel`)
   - Reporting Compliance (`/dashboard/performance/compliance`)
   - Departments & Cadres (`/dashboard/personnel/departments`)
6. **Reviews & Approvals** *(Project Engineer)*
   - Submission Reviews (`/dashboard/reviews/submissions`)
   - Report Approvals (`/dashboard/reviews/reports`)

---

## 3. How to Add a New Feature or Sidebar Link

1. **Create Feature Components**:
   - Place components in `features/<feature_name>/components/` (e.g. `features/safety/components/SafetyAuditTable.tsx`).
   - Do not name components with a `View` suffix.
2. **Create the Route Page**:
   - Add a route file in `app/dashboard/<section>/<subpage>/page.tsx`.
   - Keep the file thin by importing and composing your feature component.
   - Enforce server-side authorization using `getCurrentUser()` and `can(user, permission)`.
3. **Update Central Navigation**:
   - Add the item to `lib/navigation/workspace-navigation.ts` in the appropriate section.
   - Ensure the section does not exceed **4–5 sub-links**.
   - Specify the required permission (e.g. `permission: 'projects:read'`).
4. **Verify**:
   - Run `npm test` to verify the RBAC test suite.
   - Run `npm run lint` and `npm run build` to confirm type-safety and route generation.

---

## 4. Development & Testing Commands

```bash
# Start local development server
npm run dev

# Run unit and integration test suite
npm test

# Run ESLint checks
npm run lint

# Run full Next.js production build and TypeScript verification
npm run build
```
