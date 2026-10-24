'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  Building2,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  ExternalLink,
  Calendar,
  DollarSign,
  Award,
  Layers,
  FileText,
  Clock,
  Building,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { DEMO_PROJECTS, DEMO_REPORTS } from '@/lib/mock-data/fixtures';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface StakeholderOversightProps {
  user: CivoraUser;
  initialTab?: 'executive' | 'projects' | 'compliance' | 'reports';
}

const STATUTORY_COMPLIANCE_ITEMS = [
  {
    id: 'comp_01',
    authority: 'Federal Ministry of Environment (FMEnv)',
    permitCode: 'EIA-FMENV-2024-8841',
    title: 'Environmental Impact Assessment (EIA) Certification',
    project: 'Lagos Rail Mass Transit (Blue Line)',
    issueDate: '15 Jan 2026',
    expiryDate: '15 Jan 2028',
    status: 'compliant',
    verificationHash: '0x8f2a...c391',
    auditFrequency: 'Quarterly',
  },
  {
    id: 'comp_02',
    authority: 'Lagos State Building Control Agency (LASBCA)',
    permitCode: 'LASBCA-VI-REV-094',
    title: 'Coastal Revetment & Foundation Stability Authorization',
    project: 'Eko Atlantic Coastal Revetment',
    issueDate: '02 Feb 2026',
    expiryDate: '02 Feb 2027',
    status: 'compliant',
    verificationHash: '0x3d7b...e102',
    auditFrequency: 'Bi-Monthly',
  },
  {
    id: 'comp_03',
    authority: 'Nigerian Ports Authority (NPA) Hydrographic Dept',
    permitCode: 'NPA-HYD-QW-2026',
    title: 'Quay Wall Bathymetric Dredging & Berth Clearance',
    project: 'Lekki Deep Sea Port',
    issueDate: '10 Jan 2026',
    expiryDate: '10 Jan 2028',
    status: 'compliant',
    verificationHash: '0x99a1...ff45',
    auditFrequency: 'Monthly',
  },
  {
    id: 'comp_04',
    authority: 'Federal Capital Development Authority (FCDA Abuja)',
    permitCode: 'FCDA-ENG-CBD-04',
    title: 'Interchange Structural Loading & Right-of-Way Permit',
    project: 'Abuja CBD Outer Northern Expressway Interchange',
    issueDate: '28 Feb 2026',
    expiryDate: '28 Feb 2029',
    status: 'compliant',
    verificationHash: '0x5c4e...88bc',
    auditFrequency: 'Semi-Annual',
  },
];

export function StakeholderOversight({
  user,
  initialTab = 'executive',
}: StakeholderOversightProps) {
  const [activeTab, setActiveTab] = useState<'executive' | 'projects' | 'compliance' | 'reports'>(
    initialTab
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Financial and completion totals
  const totalPortfolioBudget = '₦226.9B';
  const certifiedCapitalDisbursed = '₦146.8B';
  const averageCompletion = Math.round(
    DEMO_PROJECTS.reduce((acc, p) => acc + p.progressPercent, 0) / DEMO_PROJECTS.length
  );

  const filteredProjects = DEMO_PROJECTS.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q)
    );
  });

  const publishedReports = DEMO_REPORTS.filter(
    (r) => r.status === 'released' || r.status === 'approved'
  );

  const handleExportSummary = (format: string) => {
    setExportNotice(`Exporting executive ${format.toUpperCase()} dossier...`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Welcome & Institutional Mandate Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#001237] via-[#18243D] to-[#001237] text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#4FAAA7]/20 text-[#4FAAA7] border border-[#4FAAA7]/30 uppercase">
              Executive Stakeholder Control Plane
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Fiduciary Mandate &bull; Multi-Project Capital Oversight
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide text-white">
            Welcome, {user.name}
          </h2>
          <p className="text-xs text-slate-300">
            {user.title || 'Stakeholder Representative'} &bull; {user.organization || 'Federal Ministry of Works & Housing'} &bull; Read-Only Audit Ledger
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Monitored Programs</span>
            <span className="text-sm font-bold text-white font-mono">{DEMO_PROJECTS.length} Capital Builds</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] text-[#4FAAA7] uppercase tracking-wider block font-mono">Verification Mode</span>
            <span className="text-sm font-bold text-[#4FAAA7] font-mono">COREN Certified</span>
          </div>
        </div>
      </div>

      {/* Header Bar matching standard App UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Executive Capital Portfolio Governance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
              COREN Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Read-only fiduciary oversight, statutory environmental permits, and certified milestone deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleExportSummary('pdf')}
            className="text-xs"
          >
            Export Dossier (PDF)
          </Button>
          <Button
            variant="teal"
            size="sm"
            leftIcon={<Award className="w-4 h-4" />}
            onClick={() => handleExportSummary('csv')}
            className="text-xs"
          >
            Audit Package (CSV)
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary KPI Ribbon (Clean White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Portfolio Valuation</span>
            <DollarSign className="w-4 h-4 text-[#4FAAA7]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalPortfolioBudget}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-[#001237] font-semibold">4 Active Programs</span>
            <span>across transport & maritime</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Certified Disbursed</span>
            <TrendingUp className="w-4 h-4 text-[#3B68DE]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{certifiedCapitalDisbursed}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-[#3B68DE] font-semibold">64.7% of Commitment</span>
            <span>milestones verified</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Physical Completion</span>
            <Building2 className="w-4 h-4 text-[#4FAAA7]" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{averageCompletion}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#4FAAA7] h-full rounded-full transition-all duration-500"
              style={{ width: `${averageCompletion}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Statutory Audit Health</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">100%</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-semibold">4 / 4 Agencies</span>
            <span>permits in active compliance</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'executive', label: 'Executive Portfolio', icon: TrendingUp },
          { id: 'projects', label: 'Capital Projects Audit', icon: Building2 },
          { id: 'compliance', label: 'Statutory Compliance', icon: Shield },
          { id: 'reports', label: 'Inspection Sign-Offs', icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#001237] text-[#001237]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Executive Portfolio */}
      {activeTab === 'executive' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Major Project Allocation Breakdown */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                    Capital Projects Disbursement Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sponsor financial allocations versus independent site engineer verification
                  </p>
                </div>
                <Badge variant="blue" size="sm">
                  FY 2026 Active
                </Badge>
              </div>

              <div className="space-y-3">
                {DEMO_PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="font-mono text-[#001237] font-bold mr-2">
                          {project.code}
                        </span>
                        <span className="font-semibold text-slate-900">{project.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-slate-900 font-bold">
                          {project.budgetFormatted}
                        </span>
                        <Badge
                          variant={project.status === 'active' ? 'teal' : 'slate'}
                          size="sm"
                        >
                          {project.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Physical Progress: {project.progressPercent}%</span>
                        <span>Client: {project.client.split('/')[0]}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#3B68DE] to-[#4FAAA7] h-full rounded-full"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality & Assurance Scorecard */}
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  COREN QA Governance Scorecard
                </h3>
                <p className="text-xs text-slate-500">
                  Compliance rating across technical engineering cadres
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Concrete Strength Validation</span>
                    <span className="text-emerald-700 font-mono font-bold">99.2%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    384 cube break tests passed FMWH C35/45 criteria
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Rebar Tensile Integrity</span>
                    <span className="text-emerald-700 font-mono font-bold">98.8%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ASTM A615 Grade 60 mill test certs authenticated
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Slump & Workability Logs</span>
                    <span className="text-teal-700 font-mono font-bold">96.5%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Zero unverified batch deliveries recorded
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Environmental & Drainage Audit</span>
                    <span className="text-emerald-700 font-mono font-bold">100%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Zero siltation infractions or coastal perimeter leaks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Capital Projects Audit */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audited capital projects..."
                className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-[#4FAAA7]"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing {filteredProjects.length} audited programs
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs text-[#001237] font-bold">
                        {project.code}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                        {project.name}
                      </h4>
                    </div>
                    <Badge
                      variant={project.status === 'active' ? 'teal' : 'slate'}
                      size="sm"
                    >
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{project.location}</span>
                  </p>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Sponsoring Client</span>
                      <span className="text-slate-800 font-medium truncate block">
                        {project.client}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Lead Project Engineer</span>
                      <span className="text-slate-800 font-medium truncate block">
                        {project.leadEngineer}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Authorized Capital</span>
                      <span className="text-slate-900 font-mono font-bold block">
                        {project.budgetFormatted}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Field Submissions</span>
                      <span className="text-slate-900 font-mono font-bold block">
                        {project.submissionsCount} submittals
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Milestone Progress</span>
                    <span className="text-slate-900 font-mono font-bold">
                      {project.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#3B68DE] to-[#4FAAA7] h-full rounded-full"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Statutory Compliance */}
      {activeTab === 'compliance' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Statutory Authorities & Environmental Permits Register
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Active operating clearances and independent verification hashes across regulatory bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STATUTORY_COMPLIANCE_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500">{item.authority}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                    <p className="text-xs text-[#001237] font-semibold mt-0.5">{item.project}</p>
                  </div>
                  <Badge variant="teal" size="sm">
                    {item.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Permit Reference</span>
                    <span className="text-slate-900 font-mono font-semibold block">{item.permitCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Audit Cadence</span>
                    <span className="text-slate-800 block">{item.auditFrequency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Valid Period</span>
                    <span className="text-slate-800 block">
                      {item.issueDate} – {item.expiryDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Proof Ledger Hash</span>
                    <span className="text-slate-600 font-mono block">{item.verificationHash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Inspection Sign-Offs */}
      {activeTab === 'reports' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Certified Engineering Inspection Releases ({publishedReports.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formally approved inspection reports signed off by registered COREN Project Engineers.
              </p>
            </div>
            <Badge variant="blue" size="sm">
              Read-Only Certified Releases
            </Badge>
          </div>

          <div className="space-y-3">
            {publishedReports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#001237] font-bold">
                      {report.reportNumber}
                    </span>
                    <Badge variant="teal" size="sm">
                      CERTIFIED RELEASE
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      Approved: {report.releasedAt || report.period}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{report.title}</h4>
                  <p className="text-xs text-slate-500">
                    Project: <span className="text-slate-800 font-medium">{report.projectName}</span> • Lead: {report.approvedBy || report.generatedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => handleExportSummary(report.reportNumber)}
                    className="text-xs"
                  >
                    Download Dossier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
