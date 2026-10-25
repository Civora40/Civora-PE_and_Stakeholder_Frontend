'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  Eye,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { getStudioTemplates } from '@/lib/services/reporting-studio-service';
import { ReportTemplate } from '@/lib/types/reporting-studio';

interface ReportingStudioTemplatesProps {
  user: CivoraUser;
}

export function ReportingStudioTemplates({ user }: ReportingStudioTemplatesProps) {
  const templates = useMemo(() => getStudioTemplates(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchFreq = frequencyFilter === 'all' || t.frequency === frequencyFilter;
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.reportType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFreq && matchSearch;
    });
  }, [templates, frequencyFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Report Templates"
        description="Standardized engineering report schemas complying with FMWH, BS 8110, Eurocode, and statutory building control requirements."
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates by title, standard, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
          />
        </div>

        <select
          value={frequencyFilter}
          onChange={(e) => setFrequencyFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
        >
          <option value="all">All Frequencies</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Milestone-Gate">Milestone-Gate</option>
          <option value="Event-Driven">Event-Driven</option>
        </select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-[#3B68DE]/40 transition-all space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="teal" size="sm">
                  {template.frequency}
                </Badge>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  v{template.version}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                {template.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {template.description}
              </p>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono mb-1.5">
                  Included Sections ({template.sections.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {template.sections.map((s) => (
                    <span
                      key={s.id}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 truncate max-w-[170px]"
                    >
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setPreviewTemplate(template)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Preview Schema</span>
              </button>

              <Link
                href={`/engineer/reports/new?templateId=${template.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge variant="teal" size="sm">{previewTemplate.frequency}</Badge>
                  <span className="font-mono text-xs text-slate-400">Version {previewTemplate.version}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-condensed tracking-tight">
                  {previewTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                {previewTemplate.description}
              </p>

              <h4 className="font-bold text-slate-900 uppercase font-mono tracking-wider pt-2">
                Template Section Schema ({previewTemplate.sections.length} Sections)
              </h4>

              <div className="space-y-3">
                {previewTemplate.sections.map((sec, idx) => (
                  <div key={sec.id} className="p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[10px] flex items-center justify-center text-slate-500">
                          {idx + 1}
                        </span>
                        {sec.title}
                      </span>
                      {sec.required ? (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                          Optional
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">
                      <strong>Guidance:</strong> {sec.guidance}
                    </p>

                    {sec.defaultContent && (
                      <div className="p-2.5 rounded-lg bg-slate-50 text-[11px] text-slate-600 font-mono leading-relaxed border border-slate-100">
                        {sec.defaultContent}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Preview
              </button>
              <Link
                href={`/engineer/reports/new?templateId=${previewTemplate.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
