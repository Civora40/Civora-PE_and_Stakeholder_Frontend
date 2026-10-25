import React from 'react';
import { getCurrentUser } from '@/lib/auth/session';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { FileText, Download, Image as ImageIcon } from 'lucide-react';
import { DEMO_SUBMISSIONS } from '@/lib/mock-data/fixtures';

export const metadata = {
  title: 'Attachments & Evidence Media | Civora Control Plane',
};

export default async function SubmissionsAttachmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Flatten all attachments across submissions
  const allAttachments = DEMO_SUBMISSIONS.flatMap((sub) =>
    (sub.attachments || []).map((att) => ({
      ...att,
      submissionId: sub.id,
      submissionIdentifier: sub.identifier,
      projectName: sub.projectName,
      senderName: sub.senderName || sub.submittedBy,
    }))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Attachments & Evidence Media"
        description="Private object storage repository with authenticated signed URLs, concrete test break logs, and site inspection media."
        badge={<Badge variant="teal" size="sm">{allAttachments.length} Verified Files</Badge>}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs">
          <span className="font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-700">
            Encrypted Evidence Storage
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            AES-256 GCM &bull; Time-Limited Signed URLs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/60 text-slate-600 font-semibold">
                <th className="py-3 px-4">Filename & Preview</th>
                <th className="py-3 px-4">Origin Submission</th>
                <th className="py-3 px-4">Project Context</th>
                <th className="py-3 px-4">File Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allAttachments.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {att.mimeType.startsWith('image/') ? (
                        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-[#4FAAA7] shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText className="w-4 h-4 text-[#4FAAA7]" />
                        </div>
                      )}
                      <div>
                        <strong className="text-slate-900 block font-semibold">{att.originalFilename}</strong>
                        <span className="font-mono text-[10px] text-slate-400">
                          Key: {att.storageKey.slice(0, 22)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#001237] block">
                      {att.submissionIdentifier}
                    </span>
                    <span className="text-[11px] text-slate-500">By {att.senderName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {att.projectName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {att.fileSizeFormatted} &bull; {att.mimeType}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={att.processingStatus === 'ready' ? 'emerald' : att.processingStatus === 'failed' ? 'rose' : 'blue'} size="sm">
                      {att.processingStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={att.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-2xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-[#4FAAA7]" />
                      <span>Download</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
