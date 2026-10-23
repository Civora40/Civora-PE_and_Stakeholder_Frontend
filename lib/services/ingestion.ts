import {
  Submission,
  Personnel,
  FileAttachment,
  IntegrationEvent,
  SourceChannel,
  ControlledCategory,
  CivoraUser,
  InformationRequest,
  ProjectTask,
} from '../../types';
import {
  DEMO_SUBMISSIONS,
  DEMO_PERSONNEL,
  DEMO_INTEGRATION_EVENTS,
  DEMO_TASKS,
  DEMO_ACTIVITIES,
} from '../mock-data/fixtures';

/**
 * In-memory stores for runtime demonstration and testing
 */
const submissionsStore: Submission[] = [...DEMO_SUBMISSIONS];
const personnelStore: Personnel[] = [...DEMO_PERSONNEL];
const integrationEventsStore: IntegrationEvent[] = [...DEMO_INTEGRATION_EVENTS];
const seenMessageIds = new Set<string>(
  DEMO_SUBMISSIONS.map((s) => s.providerMessageId).filter(Boolean) as string[]
);

export interface InboundWebhookPayload {
  channel: SourceChannel;
  providerEventId: string;
  providerMessageId: string;
  senderRaw: string; // Phone number e.g. "+2348034192084" or Telegram handle "@chidinma_geo_lead"
  projectId?: string;
  messageText: string;
  timestamp?: string;
  attachments?: {
    originalFilename: string;
    mimeType: string;
    fileSizeBytes: number;
    providerMediaId?: string;
    category?: FileAttachment['category'];
    simulateFailure?: boolean;
  }[];
}

export interface IngestionResult {
  status: 'created' | 'duplicate_blocked' | 'identity_pending';
  submission?: Submission;
  event: IntegrationEvent;
  message: string;
}

/**
 * Normalizes phone numbers for matching (removes spaces, dashes, parentheses).
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Resolves sender identity against verified contact methods.
 * Displays masked contact reference per privacy policy.
 */
export function resolveSenderByContact(
  channel: SourceChannel,
  senderRaw: string,
  personnelList: Personnel[] = personnelStore
): Personnel | null {
  const cleanSender = senderRaw.trim().toLowerCase();

  for (const person of personnelList) {
    for (const contact of person.verifiedContacts) {
      if (!contact.isActive) continue;

      if (channel === 'whatsapp' && (contact.type === 'whatsapp' || contact.type === 'phone')) {
        const cleanContact = normalizePhoneNumber(contact.value).toLowerCase();
        const cleanInput = normalizePhoneNumber(senderRaw).toLowerCase();
        if (cleanContact === cleanInput || cleanContact.endsWith(cleanInput.slice(-10))) {
          return person;
        }
      }

      if (channel === 'telegram' && contact.type === 'telegram') {
        const contactUser = contact.value.toLowerCase().replace('@', '');
        const inputUser = cleanSender.replace('@', '');
        if (contactUser === inputUser) {
          return person;
        }
      }
    }
  }

  return null;
}

/**
 * Masks a phone number or handle for UI presentation
 */
export function maskContact(value: string): string {
  if (value.startsWith('+')) {
    const parts = value.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ••• ${parts.slice(-1)[0]}`;
    }
    return `${value.slice(0, 7)} ••• ${value.slice(-4)}`;
  }
  if (value.startsWith('@')) {
    return `${value.slice(0, 5)}•••`;
  }
  return `${value.slice(0, 4)} ••• ${value.slice(-3)}`;
}

/**
 * Rule-based heuristic classification suggestions
 */
export function suggestCategoryAndFlag(
  text: string,
  attachmentsCount = 0
): {
  primaryCategory: ControlledCategory;
  isSuggestedCategory: boolean;
  flagStatus: Submission['aiFlag']['status'];
  flagMessage: string;
  specRef: string;
} {
  const lower = text.toLowerCase();
  const attachmentNote = attachmentsCount > 0 ? ` (${attachmentsCount} media attachment(s) attached)` : '';

  if (lower.includes('break') || lower.includes('cylinder') || lower.includes('slump') || lower.includes('psi')) {
    return {
      primaryCategory: 'Testing / Commissioning',
      isSuggestedCategory: true,
      flagStatus: lower.includes('low') || lower.includes('fail') || lower.includes('71%') || lower.includes('2,850')
        ? 'advisory_discrepancy'
        : 'spec_compliant',
      flagMessage: `Compressive/slump test telemetry logged${attachmentNote}. Suggested for certified engineer review.`,
      specRef: 'Spec 033000 §2.4 Table 1B',
    };
  }

  if (lower.includes('rebar') || lower.includes('mill') || lower.includes('steel') || lower.includes('heat')) {
    return {
      primaryCategory: 'Materials & Deliveries',
      isSuggestedCategory: true,
      flagStatus: 'spec_compliant',
      flagMessage: 'Mill heat and tensile values conform to ASTM A615 tolerances.',
      specRef: 'ASTM A615 / A706 Seismic Ductility',
    };
  }

  if (lower.includes('safety') || lower.includes('ppe') || lower.includes('hazard') || lower.includes('incident')) {
    return {
      primaryCategory: 'Health & Safety',
      isSuggestedCategory: true,
      flagStatus: 'spec_compliant',
      flagMessage: 'Site safety walk notes logged. No immediate structural violations detected.',
      specRef: 'OSHA 1926 Civil Construction Safety',
    };
  }

  if (lower.includes('inclinometer') || lower.includes('shoring') || lower.includes('deflection') || lower.includes('soil')) {
    return {
      primaryCategory: 'Site Work / Daily Progress',
      isSuggestedCategory: true,
      flagStatus: lower.includes('deflection') || lower.includes('exceed')
        ? 'advisory_discrepancy'
        : 'spec_compliant',
      flagMessage: 'Geotechnical telemetry variance detected against baseline monitoring limits.',
      specRef: 'Shoring Spec 315000 §3.2',
    };
  }

  return {
    primaryCategory: 'General Update',
    isSuggestedCategory: true,
    flagStatus: 'spec_compliant',
    flagMessage: 'General field observation. No automated anomalies detected.',
    specRef: 'General Field Practice BS 8110',
  };
}

/**
 * Process inbound messaging payload with idempotency, duplicate suppression,
 * identity resolution, attachment verification, and error tracking.
 */
export function processInboundWebhook(payload: InboundWebhookPayload): IngestionResult {
  const now = new Date().toISOString();

  // 1. Idempotency Check: Reject duplicate providerMessageId
  if (seenMessageIds.has(payload.providerMessageId)) {
    const dupEvent: IntegrationEvent = {
      id: `evt_dup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      channel: payload.channel,
      providerEventId: payload.providerEventId,
      providerMessageId: payload.providerMessageId,
      status: 'duplicate_blocked',
      receivedAt: now,
      senderRaw: payload.senderRaw,
      payloadSummary: payload.messageText.slice(0, 80),
      errorMessage: `Duplicate providerMessageId [${payload.providerMessageId}] suppressed to prevent double-counting.`,
    };
    integrationEventsStore.unshift(dupEvent);

    return {
      status: 'duplicate_blocked',
      event: dupEvent,
      message: 'Duplicate event ignored: provider message ID has already been ingested.',
    };
  }

  seenMessageIds.add(payload.providerMessageId);

  // 2. Identity Resolution
  const resolvedPersonnel = resolveSenderByContact(payload.channel, payload.senderRaw);

  const defaultProjectId = payload.projectId || (resolvedPersonnel?.assignedProjects[0] ?? 'prj_metro_01');
  const defaultProjectName =
    defaultProjectId === 'prj_metro_01'
      ? 'Lagos Rail Mass Transit (Blue Line) — Viaduct & Station'
      : defaultProjectId === 'prj_civic_02'
      ? 'Eko Atlantic Coastal Revetment & Great Wall Defense'
      : 'Lekki Deep Sea Port — Quay Wall & Breakwater Extension';

  const classification = suggestCategoryAndFlag(payload.messageText, payload.attachments?.length || 0);

  const submissionId = `sub_${payload.channel === 'whatsapp' ? 'wa' : 'tg'}_${Date.now()}`;
  const identifier = `SUB-${payload.channel === 'whatsapp' ? 'WA' : 'TG'}-2026-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  // 3. Attachment Processing
  const attachments: FileAttachment[] = (payload.attachments || []).map((att, idx) => {
    const attId = `att_${Date.now()}_${idx}`;
    const isFailed = att.simulateFailure === true;

    return {
      id: attId,
      submissionId,
      projectId: defaultProjectId,
      senderPersonnelId: resolvedPersonnel?.id,
      sourceChannel: payload.channel,
      providerMediaId: att.providerMediaId || `med_${payload.channel}_${idx}`,
      originalFilename: att.originalFilename,
      storageKey: isFailed
        ? `temp/failed_${attId}`
        : `${defaultProjectId}/${submissionId}/${att.originalFilename.replace(/\s+/g, '_')}`,
      mimeType: att.mimeType,
      fileSizeBytes: att.fileSizeBytes,
      fileSizeFormatted: `${(att.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`,
      checksum: isFailed ? 'pending' : `sha256:${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
      receivedTime: now,
      downloadUrl: isFailed ? '#' : `/api/attachments/${attId}/download?token=sim_${Math.random().toString(36).slice(2, 8)}`,
      processingStatus: isFailed ? 'failed' : 'ready',
      errorMessage: isFailed
        ? `Failed to stream media from ${payload.channel === 'whatsapp' ? 'Meta Cloud API' : 'Telegram Bot API'}. Network timeout (504). Retryable.`
        : undefined,
      category: att.category || 'document',
    };
  });

  const isIdentityVerified = !!resolvedPersonnel;

  // 4. Create Normalized Submission
  const newSubmission: Submission = {
    id: submissionId,
    identifier,
    projectId: defaultProjectId,
    projectName: defaultProjectName,
    reportingGroup: classification.primaryCategory,
    primaryCategory: classification.primaryCategory,
    secondaryTags: [payload.channel.toUpperCase(), 'Field Ingestion'],
    title: payload.messageText.length > 50 ? `${payload.messageText.slice(0, 50)}...` : payload.messageText,
    description: payload.messageText,
    receivedDate: now,
    platformTimestamp: payload.timestamp || now,
    sourceChannel: payload.channel,
    providerMessageId: payload.providerMessageId,
    providerEventId: payload.providerEventId,
    senderPersonnelId: resolvedPersonnel?.id,
    senderName: resolvedPersonnel ? resolvedPersonnel.fullName : 'Unknown Field Submitter',
    senderRole: resolvedPersonnel ? resolvedPersonnel.professionalTitle : 'Unverified Submitter',
    senderDepartment: resolvedPersonnel ? resolvedPersonnel.department : 'Pending Resolution',
    senderCivoraRole: resolvedPersonnel?.civoraRole,
    senderVerificationStatus: isIdentityVerified ? 'verified' : 'needs_verification',
    maskedContactReference: maskContact(payload.senderRaw),
    isSuggestedCategory: classification.isSuggestedCategory,
    submittedBy: resolvedPersonnel ? `${resolvedPersonnel.fullName} (${resolvedPersonnel.organization})` : `Unverified (${maskContact(payload.senderRaw)})`,
    subcontractor: resolvedPersonnel?.organization || 'Unverified Contractor',
    reviewStatus: isIdentityVerified ? 'pending_review' : 'needs_verification',
    aiFlag: {
      status: !isIdentityVerified ? 'unverified' : classification.flagStatus,
      message: !isIdentityVerified
        ? `Sender contact [${maskContact(payload.senderRaw)}] is unmapped. Identification required before engineering review.`
        : classification.flagMessage,
      confidence: isIdentityVerified ? 0.92 : 0.45,
      specRef: classification.specRef,
      disclaimer: 'AI Advisory: Automated ingestion suggestion. Professional review required.',
      suggestedCategory: classification.primaryCategory,
    },
    evidenceItems: attachments.map((att) => ({
      id: att.id,
      type:
        att.category === 'drawing' ||
        att.category === 'test_report' ||
        att.category === 'site_photo' ||
        att.category === 'sensor_log' ||
        att.category === 'spec_sheet'
          ? att.category
          : 'test_report',
      title: att.originalFilename,
      filename: att.originalFilename,
      size: att.fileSizeFormatted,
      timestamp: now.slice(0, 16).replace('T', ' '),
      verified: att.processingStatus === 'ready',
    })),
    attachments,
    history: [
      {
        id: `h_${Date.now()}`,
        timestamp: now,
        actor: `${payload.channel === 'whatsapp' ? 'WhatsApp Business' : 'Telegram'} Ingestion Gateway`,
        actorRole: 'System Integration',
        action: isIdentityVerified
          ? `Ingested and mapped to verified personnel ${resolvedPersonnel?.fullName}.`
          : `Ingested from unmapped sender [${maskContact(payload.senderRaw)}]. Placed in Identity Needs Verification queue.`,
      },
    ],
  };

  submissionsStore.unshift(newSubmission);

  // 5. Record Integration Event
  const intEvent: IntegrationEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    channel: payload.channel,
    providerEventId: payload.providerEventId,
    providerMessageId: payload.providerMessageId,
    status: !isIdentityVerified ? 'identity_pending' : attachments.some((a) => a.processingStatus === 'failed') ? 'media_failed' : 'success',
    receivedAt: now,
    senderRaw: payload.senderRaw,
    senderIdentity: resolvedPersonnel ? resolvedPersonnel.fullName : 'Unknown Submitter',
    payloadSummary: payload.messageText.slice(0, 80),
    errorMessage: !isIdentityVerified
      ? `Sender [${payload.senderRaw}] not mapped to any active Personnel record.`
      : undefined,
  };
  integrationEventsStore.unshift(intEvent);

  return {
    status: isIdentityVerified ? 'created' : 'identity_pending',
    submission: newSubmission,
    event: intEvent,
    message: isIdentityVerified
      ? `Submission ${identifier} created successfully and routed to Project Engineer inbox.`
      : `Submission ${identifier} created in Identity Needs Verification queue.`,
  };
}

/**
 * Resolve sender identity for an unverified submission
 */
export function resolveSenderIdentity(
  submissionId: string,
  personnelId: string,
  actor: CivoraUser,
  resolutionNote?: string
): { success: boolean; submission?: Submission; error?: string } {
  const subIndex = submissionsStore.findIndex((s) => s.id === submissionId);
  if (subIndex === -1) {
    return { success: false, error: 'Submission not found' };
  }

  const personnel = personnelStore.find((p) => p.id === personnelId);
  if (!personnel) {
    return { success: false, error: 'Selected personnel record not found' };
  }

  const sub = submissionsStore[subIndex];
  const updated: Submission = {
    ...sub,
    senderPersonnelId: personnel.id,
    senderName: personnel.fullName,
    senderRole: personnel.professionalTitle,
    senderDepartment: personnel.department,
    senderCivoraRole: personnel.civoraRole,
    senderVerificationStatus: 'verified',
    submittedBy: `${personnel.fullName} (${personnel.organization})`,
    subcontractor: personnel.organization,
    reviewStatus: sub.reviewStatus === 'needs_verification' ? 'pending_review' : sub.reviewStatus,
    aiFlag: {
      ...sub.aiFlag,
      status: sub.aiFlag.status === 'unverified' ? 'spec_compliant' : sub.aiFlag.status,
      message: `Identity confirmed by ${actor.name}. Field submittal ready for engineering review.`,
    },
    history: [
      ...(sub.history || []),
      {
        id: `h_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: actor.name,
        actorRole: actor.role,
        action: `Identity resolved and attributed to ${personnel.fullName} (${personnel.professionalTitle}). Note: ${resolutionNote || 'Verified by authorized engineer.'}`,
      },
    ],
  };

  submissionsStore[subIndex] = updated;
  return { success: true, submission: updated };
}

/**
 * Link submission to task
 */
export function linkSubmissionToTask(
  submissionId: string,
  taskId: string,
  actor: CivoraUser,
  activityNote?: string
): { success: boolean; submission?: Submission; task?: ProjectTask; error?: string } {
  const subIndex = submissionsStore.findIndex((s) => s.id === submissionId);
  if (subIndex === -1) {
    return { success: false, error: 'Submission not found' };
  }

  const taskIndex = DEMO_TASKS.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return { success: false, error: 'Task not found' };
  }

  const sub = submissionsStore[subIndex];
  const task = DEMO_TASKS[taskIndex];

  // Update submission
  const updatedSub: Submission = {
    ...sub,
    linkedTaskId: task.id,
    linkedTaskTitle: task.title,
    history: [
      ...(sub.history || []),
      {
        id: `h_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: actor.name,
        actorRole: actor.role,
        action: `Linked to Task [${task.code}: ${task.title}].`,
      },
    ],
  };
  submissionsStore[subIndex] = updatedSub;

  // Update task
  if (!task.linkedSubmissions.includes(sub.id)) {
    task.linkedSubmissions.push(sub.id);
  }

  // Create/update activity record
  DEMO_ACTIVITIES.unshift({
    id: `act_${Date.now()}`,
    projectId: sub.projectId,
    projectName: sub.projectName,
    personnelId: sub.senderPersonnelId || 'unassigned',
    personnelName: sub.senderName || 'Field Submitter',
    date: new Date().toISOString().slice(0, 10),
    taskReference: task.code,
    taskTitle: task.title,
    activityDescription: activityNote || `Linked submission ${sub.identifier} as work evidence for ${task.title}.`,
    submissionIds: [sub.id],
    status: 'verified',
    verifiedBy: actor.name,
    verifiedAt: new Date().toISOString(),
  });

  return { success: true, submission: updatedSub, task };
}

/**
 * Request missing information from submitter
 */
export function requestMissingInformation(
  submissionId: string,
  queryText: string,
  channel: SourceChannel,
  actor: CivoraUser,
  dueDate?: string
): { success: boolean; submission?: Submission; request?: InformationRequest; error?: string } {
  const subIndex = submissionsStore.findIndex((s) => s.id === submissionId);
  if (subIndex === -1) {
    return { success: false, error: 'Submission not found' };
  }

  const sub = submissionsStore[subIndex];
  const infoReq: InformationRequest = {
    id: `ir_${Date.now()}`,
    submissionId: sub.id,
    recipient: sub.senderName || 'Submitter',
    recipientContactMasked: sub.maskedContactReference,
    channel,
    requestedBy: actor.name,
    requestedAt: new Date().toISOString(),
    queryText,
    dueDate,
    status: 'open',
  };

  const updatedSub: Submission = {
    ...sub,
    reviewStatus: 'needs_information',
    informationRequests: [...(sub.informationRequests || []), infoReq],
    history: [
      ...(sub.history || []),
      {
        id: `h_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: actor.name,
        actorRole: actor.role,
        action: `Requested missing information via ${channel.toUpperCase()}: "${queryText}". Status changed to Needs Information.`,
      },
    ],
  };

  submissionsStore[subIndex] = updatedSub;
  return { success: true, submission: updatedSub, request: infoReq };
}

/**
 * Retry failed attachment download
 */
export function retryAttachmentDownload(
  submissionId: string,
  attachmentId: string
): { success: boolean; attachment?: FileAttachment; error?: string } {
  const sub = submissionsStore.find((s) => s.id === submissionId);
  if (!sub || !sub.attachments) {
    return { success: false, error: 'Submission or attachments not found' };
  }

  const att = sub.attachments.find((a) => a.id === attachmentId);
  if (!att) {
    return { success: false, error: 'Attachment not found' };
  }

  // Simulate successful retry
  att.processingStatus = 'ready';
  att.errorMessage = undefined;
  att.fileSizeBytes = 1840291;
  att.fileSizeFormatted = '1.8 MB';
  att.checksum = `sha256:${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
  att.downloadUrl = `/api/attachments/${att.id}/download?token=retried_${Math.random().toString(36).slice(2, 6)}`;

  return { success: true, attachment: att };
}

/**
 * Get all current submissions in store
 */
export function getSubmissionsStore(): Submission[] {
  return submissionsStore;
}

/**
 * Get all current integration events in store
 */
export function getIntegrationEventsStore(): IntegrationEvent[] {
  return integrationEventsStore;
}

/**
 * Get all personnel
 */
export function getPersonnelStore(): Personnel[] {
  return personnelStore;
}
