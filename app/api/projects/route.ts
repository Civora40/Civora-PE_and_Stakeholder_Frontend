import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { DEMO_PROJECTS, DEMO_ACTIVITIES } from '@/lib/mock-data/fixtures';
import { can } from '@/lib/permissions/rbac';
import { Project, ActivityRecord } from '@/types';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    projects: DEMO_PROJECTS,
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Authorization check: only users with projects:manage (e.g. project_engineer, platform_admin)
  if (!can(user, 'projects:manage')) {
    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions to create projects' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    // Required fields validation
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    if (!body.code?.trim()) {
      return NextResponse.json({ error: 'Project code is required' }, { status: 400 });
    }
    if (!body.client?.trim()) {
      return NextResponse.json({ error: 'Client or sponsoring organization is required' }, { status: 400 });
    }

    const cleanCode = body.code.trim().toUpperCase();

    // Check code uniqueness
    const codeExists = DEMO_PROJECTS.some(
      (p) => p.code.toUpperCase() === cleanCode
    );
    if (codeExists) {
      return NextResponse.json(
        { error: `Project code '${cleanCode}' is already registered in the system` },
        { status: 409 }
      );
    }

    // Format budget
    const currencySymbol = body.currency || '₦';
    const rawBudget = body.budgetAmount ? String(body.budgetAmount).trim() : '0';
    const formattedBudget = rawBudget.includes('B') || rawBudget.includes('M') || rawBudget.includes('K')
      ? `${currencySymbol}${rawBudget}`
      : `${currencySymbol}${rawBudget}M`;

    const locationString = [body.city, body.state, body.country]
      .filter(Boolean)
      .join(', ') || 'Authorized Field Site';

    const newProject: Project = {
      id: `prj_${Date.now()}`,
      code: cleanCode,
      name: body.name.trim(),
      client: body.client.trim(),
      location: locationString,
      status: body.status === 'planning' ? 'planning' : 'active',
      leadEngineer: body.leadEngineer || user.name || 'Marcus Vance, PE (COREN Reg.)',
      progressPercent: 0,
      submissionsCount: 0,
      pendingReviewsCount: 0,
      reportsCount: 0,
      lastActivity: 'Just now',
      budgetFormatted: formattedBudget,
      specsReference: body.specsReference || 'Eurocode 2 & FMWH Standard Specifications (C35/45)',
      // Extended Metadata
      projectType: body.projectType || 'Road / Highway',
      description: body.description || '',
      contractRef: body.contractRef || '',
      priority: body.priority || 'normal',
      country: body.country || 'Nigeria',
      state: body.state || '',
      city: body.city || '',
      siteAddress: body.siteAddress || '',
      coordinates: body.coordinates || '',
      startDate: body.startDate || '',
      completionDate: body.completionDate || '',
      scopeSummary: body.scopeSummary || '',
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
      milestonesList: Array.isArray(body.milestonesList) ? body.milestonesList : [],
      constraints: body.constraints || '',
      contractor: body.contractor || '',
      clientRep: body.clientRep || '',
      stakeholders: Array.isArray(body.stakeholders) ? body.stakeholders : [],
      assignedTeam: Array.isArray(body.assignedTeam) ? body.assignedTeam : [],
      escalationContact: body.escalationContact || '',
      reportingCadence: body.reportingCadence || 'daily',
      submissionChannels: Array.isArray(body.submissionChannels) ? body.submissionChannels : ['whatsapp', 'telegram', 'portal'],
      reportingCategories: Array.isArray(body.reportingCategories) ? body.reportingCategories : [],
      stakeholderReviewRequired: body.stakeholderReviewRequired ?? true,
      requireLabBreakCert: body.requireLabBreakCert ?? true,
      requireGeotaggedPhotos: body.requireGeotaggedPhotos ?? true,
      governanceNotes: body.governanceNotes || '',
    };

    // Insert at front of DEMO_PROJECTS
    DEMO_PROJECTS.unshift(newProject);

    // Record an audit entry in DEMO_ACTIVITIES
    const newActivity: ActivityRecord = {
      id: `act_${Date.now()}`,
      projectId: newProject.id,
      projectName: newProject.name,
      personnelId: user.id,
      personnelName: user.name,
      date: new Date().toISOString().split('T')[0],
      activityDescription: `New infrastructure project ${newProject.code} (${newProject.name}) initialized by ${user.name}.`,
      submissionIds: [],
      status: 'verified',
      reviewerOutcome: 'Project Scope Provisioned',
      verifiedBy: user.name,
      verifiedAt: new Date().toISOString(),
    };
    DEMO_ACTIVITIES.unshift(newActivity);

    // Ensure engineer has access in session
    if (user.assignedProjects && !user.assignedProjects.includes('*') && !user.assignedProjects.includes(newProject.id)) {
      user.assignedProjects.push(newProject.id);
    }

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

