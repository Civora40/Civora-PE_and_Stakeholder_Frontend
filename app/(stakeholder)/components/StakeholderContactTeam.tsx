'use client';

import React, { useState, useMemo } from 'react';
import {
  ContactRound,
  Mail,
  Send,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_TEAM } from '@/lib/mock-data/stakeholder';

interface StakeholderContactTeamProps {
  user: CivoraUser;
  projects: Project[];
}

export function StakeholderContactTeam({ user, projects }: StakeholderContactTeamProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [category, setCategory] = useState<string>('Technical Query');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  // Set default project on load
  React.useEffect(() => {
    if (assignedProjectsList.length > 0 && !selectedProjectId) {
      setSelectedProjectId(assignedProjectsList[0].id);
    }
  }, [assignedProjectsList, selectedProjectId]);

  const projectLeads = useMemo(() => {
    return STAKEHOLDER_TEAM.filter(
      (m) => authorizedProjectIds.has(m.projectId) && (selectedProjectId === 'all' || m.projectId === selectedProjectId)
    );
  }, [authorizedProjectIds, selectedProjectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate server-side processing
    setTimeout(() => {
      const ref = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setIsSubmitting(false);
      setSubmittedReference(ref);
      setSubject('');
      setMessage('');
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Project Team"
        description="Submit official stakeholder inquiries and reach designated engineering leads and regulatory liaison officers."
      />


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Submit Formal Stakeholder Inquiry
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Directly routed to the verified project lead and logged in the project governance audit trail.
            </p>
          </div>

          {submittedReference ? (
            <div className="p-6 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <h3 className="text-sm font-bold">Inquiry Successfully Dispatched</h3>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Your message has been assigned reference{' '}
                <strong className="font-mono text-emerald-950 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
                  {submittedReference}
                </strong>
                . The assigned project engineering lead will review and respond within 24 business hours.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmittedReference(null)}
                  className="text-xs px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Related Project</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 font-medium"
                    required
                  >
                    {assignedProjectsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Inquiry Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 font-medium"
                  >
                    <option value="Technical Query">Technical Query & Specification</option>
                    <option value="Schedule / Milestone">Schedule / Milestone Clarification</option>
                    <option value="Document Request">Document or Test Lab Request</option>
                    <option value="Site Access">Site Inspection Gate Request</option>
                    <option value="Governance">Governance & Regulatory Liaison</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Clarification on Marina Concourse concrete crush test cert"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Detailed Message</label>
                <textarea
                  rows={5}
                  placeholder="Provide precise details, document numbers, or specific questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated as {user.name} ({user.email})</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Designated Project Team Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 font-condensed tracking-tight">
                Designated Project Contacts
              </h3>
              <p className="text-[11px] text-slate-500">
                Authorized engineering personnel assigned to respond to stakeholder inquiries.
              </p>
            </div>

            <div className="space-y-3">
              {projectLeads.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 space-y-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{member.name}</h4>
                      <p className="text-[11px] text-slate-500">{member.title}</p>
                    </div>
                    {member.isLead && (
                      <Badge variant="teal" size="sm">
                        Lead
                      </Badge>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {member.responsibility}
                  </p>

                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[10px] text-slate-400">
                      {member.department}
                    </span>
                    <a
                      href={`mailto:${member.permittedContact}?subject=Civora%20Inquiry%20from%20${encodeURIComponent(user.name)}`}
                      className="inline-flex items-center gap-1 text-[#3B68DE] font-semibold hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{member.permittedContact}</span>
                    </a>
                  </div>
                </div>
              ))}

              {projectLeads.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-500">
                  No designated contacts found for this project selection.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Communication Governance</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              All communications sent via this portal are recorded in compliance with statutory project governance standards. For emergency site matters, contact the site office duty desk directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
