'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowLeft,
  Building,
  User,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { StakeholderSharedDocument } from '@/lib/mock-data/stakeholder';

interface StakeholderDocumentDetailProps {
  user: CivoraUser;
  document: StakeholderSharedDocument;
}

export function StakeholderDocumentDetail({ user, document }: StakeholderDocumentDetailProps) {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownload = () => {
    setDownloadNotice(`Authorizing cryptographically signed URL for ${document.code}...`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/stakeholder/documents"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shared Documents</span>
        </Link>
      </div>

      {/* Download Toast Notification */}
      {downloadNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#001237] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#4FAAA7]/50 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Download className="w-4 h-4 text-[#4FAAA7] animate-bounce" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Document Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-[#001237] bg-slate-100 px-2 py-0.5 rounded">
                {document.code}
              </span>
              <Badge variant="teal" size="sm">
                {document.category}
              </Badge>
              <Badge variant="emerald" size="sm">
                {document.status}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
              {document.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {document.projectName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Download className="w-4 h-4 text-[#4FAAA7]" />
            <span>Download Certified File</span>
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Revision / Version</span>
            <span className="font-mono text-xs font-bold text-slate-800">{document.version}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">File Type & Size</span>
            <span className="font-mono text-xs font-bold text-slate-800">{document.fileType} ({document.fileSize})</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Release Date</span>
            <span className="font-mono text-xs font-bold text-slate-800">{document.releaseDate}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Security Integrity</span>
            <span className="font-mono text-xs font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 Intact</span>
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <h2 className="text-xs font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-slate-700">
            Document Summary & Technical Scope
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {document.summary}
          </p>
        </div>

        {/* Verification Stamping */}
        <div className="p-4 rounded-xl bg-[#001237]/5 border border-[#001237]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#4FAAA7]" />
            <div>
              <strong className="text-slate-900 block font-semibold">Authorizing Superintending Engineer</strong>
              <span className="text-[11px] text-slate-500">{document.uploadedBy}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Checksum: {document.securityHash}
          </span>
        </div>
      </div>
    </div>
  );
}
