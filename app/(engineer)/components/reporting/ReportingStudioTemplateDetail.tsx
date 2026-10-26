'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Calendar,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Building,
  ShieldCheck,
  PlusCircle,
  Layout,
  HelpCircle,
  Check,
} from 'lucide-react';

import { CivoraUser } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ReportTemplate } from '@/lib/types/reporting-studio';

interface ReportingStudioTemplateDetailProps {
  user: CivoraUser;
  template: ReportTemplate;
}

export function ReportingStudioTemplateDetail({
  user,
  template,
}: ReportingStudioTemplateDetailProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/engineer/reports" className="hover:text-slate-900 transition-colors">
              Reporting Studio
            </Link>
            <span>/</span>
            <Link href="/engineer/reports/templates" className="hover:text-slate-900 transition-colors">
              Report Templates
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{template.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-condensed">
              {template.name}
            </h1>
            <Badge variant="teal" size="sm">
              v{template.version}
            </Badge>
            <Badge variant="blue" size="sm">
              {template.frequency}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{template.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/engineer/reports/templates"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            Back to Gallery
          </Link>

          <Link
            href={`/engineer/reports/new?templateId=${template.id}`}
            className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Start Report from Template</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Template Schema + Layout Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sections Schema */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-condensed">Pre-Configured Section Schema</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard sections included automatically upon draft initialization.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {template.sections.length} Sections Defined
            </span>
          </div>

          <div className="space-y-4">
            {template.sections.map((sec, idx) => (
              <div key={sec.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#001237] text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900">{sec.title}</h4>
                  </div>
                  <Badge variant={sec.required ? 'blue' : 'slate'} size="sm">
                    {sec.required ? 'Mandatory' : 'Optional'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">{sec.guidance}</p>

                {sec.defaultContent && (
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase block mb-0.5 font-bold">
                      Default Initial Content:
                    </span>
                    {sec.defaultContent}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Template Metadata & Default Layout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 font-condensed uppercase tracking-wider">
              Template Specifications
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 pb-1.5 border-b border-slate-100">
                <span>Report Classification:</span>
                <span className="font-semibold text-slate-900">{template.reportType}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-1.5 border-b border-slate-100">
                <span>Revision Version:</span>
                <span className="font-mono font-semibold text-slate-900">v{template.version}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-1.5 border-b border-slate-100">
                <span>Default Paper Size:</span>
                <span className="font-semibold text-slate-900">A4 (210 × 297 mm)</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-1.5 border-b border-slate-100">
                <span>Default Orientation:</span>
                <span className="font-semibold text-slate-900">Portrait</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-1.5 border-b border-slate-100">
                <span>Default Margins:</span>
                <span className="font-semibold text-slate-900 font-mono">25mm Standard</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Governing Standard:</span>
                <span className="font-semibold text-slate-900">COREN / LASBCA Stage Gate</span>
              </div>
            </div>

            <Link
              href={`/engineer/reports/new?templateId=${template.id}`}
              className="w-full py-2.5 bg-[#001237] hover:bg-[#18243D] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Initialize Draft</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
