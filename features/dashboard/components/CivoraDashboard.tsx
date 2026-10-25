'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MoreVertical,
  Crosshair,
  Zap,
  ShieldCheck,
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  UserPlus,
  Users,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Layout,
  Check,
  Award,
  Phone,
  Send,
  UserCheck,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { ROLE_LABELS } from '@/lib/permissions/rbac';

interface CivoraDashboardProps {
  user: CivoraUser;
}

interface SubmittalItem {
  id: string;
  submittalId: string;
  title: string;
  packageGroup: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: {
    name: string;
    avatar?: string;
  };
  status: 'In Review' | 'Approved' | 'In Progress';
  receivedDate: string;
  slaDue: string;
}

const INITIAL_SUBMITTALS: SubmittalItem[] = [
  {
    id: 's-1',
    submittalId: '#SUB-2319',
    title: 'Foundation pour card C30/37 deck sign-off',
    packageGroup: 'Structural Concrete',
    priority: 'High',
    assignedTo: {
      name: 'Engr. Marcus Vance, PE',
    },
    status: 'In Review',
    receivedDate: '2026-10-18',
    slaDue: '2h left',
  },
  {
    id: 's-2',
    submittalId: '#SUB-2320',
    title: 'Rebar tensile strength test cert (Kamsteel 460)',
    packageGroup: 'Reinforcing Steel',
    priority: 'Medium',
    assignedTo: {
      name: 'Engr. Sarah Lee',
    },
    status: 'Approved',
    receivedDate: '2026-10-19',
    slaDue: '1h left',
  },
  {
    id: 's-3',
    submittalId: '#SUB-2321',
    title: 'EIA drainage outfall compliance verification',
    packageGroup: 'Environmental Works',
    priority: 'Low',
    assignedTo: {
      name: 'Engr. John Doe',
    },
    status: 'In Progress',
    receivedDate: '2026-10-19',
    slaDue: '1d left',
  },
  {
    id: 's-4',
    submittalId: '#SUB-2322',
    title: 'Dangote 42.5R batch cube crushing log (7-Day)',
    packageGroup: 'Structural Concrete',
    priority: 'Medium',
    assignedTo: {
      name: 'Engr. Michael Wong',
    },
    status: 'In Progress',
    receivedDate: '2026-10-20',
    slaDue: '9h left',
  },
  {
    id: 's-5',
    submittalId: '#SUB-2323',
    title: 'LASBCA Stage 2 structural notice acknowledgment',
    packageGroup: 'Statutory Permits',
    priority: 'High',
    assignedTo: {
      name: 'Engr. Marcus Vance, PE',
    },
    status: 'In Review',
    receivedDate: '2026-10-20',
    slaDue: '4h left',
  },
  {
    id: 's-6',
    submittalId: '#SUB-2324',
    title: 'Soil compaction plate load test (Lekki Coastal Silt)',
    packageGroup: 'Geotechnical / Piling',
    priority: 'Low',
    assignedTo: {
      name: 'Engr. Sarah Lee',
    },
    status: 'Approved',
    receivedDate: '2026-10-21',
    slaDue: '8h left',
  },
];

const WEEK_BARS = [
  { day: 'Sun', value: 420, height: 52 },
  { day: 'Mon', value: 530, height: 66 },
  { day: 'Tue', value: 584, height: 73, highlighted: true },
  { day: 'Wed', value: 510, height: 64 },
  { day: 'Thu', value: 620, height: 78 },
  { day: 'Fri', value: 540, height: 68 },
  { day: 'Sat', value: 460, height: 58 },
];

export function CivoraDashboard({ user }: CivoraDashboardProps) {
  // Date filter state
  const [dateFilter, setDateFilter] = useState('Last week');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Active bar for volume chart tooltip
  const [activeDayIndex, setActiveDayIndex] = useState(2); // Tuesday

  // Activity filter state
  const [activityFilter, setActivityFilter] = useState<'today' | 'yesterday' | 'week'>('today');
  const [activitySearch, setActivitySearch] = useState('');

  // Table state
  const [tableSearch, setTableSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(['s-1']);
  const [sortField, setSortField] = useState<keyof SubmittalItem>('receivedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const roleInfo = ROLE_LABELS[user.role] || {
    badge: 'Engineer',
    title: 'Project Engineer',
    description: 'Project-level operational controls',
  };

  // Section 5 MD Specification: Dynamic Headers & Subheadings by Role
  const roleHeading =
    user.role === 'project_engineer'
      ? 'Project Overview'
      : 'Project Updates';

  const roleSubheading =
    user.role === 'project_engineer'
      ? 'Track site submissions, outstanding laboratory reports, and report progress across assigned builds.'
      : 'View verified project progress and access released inspection reports across your authorized projects.';

  // Filtered & sorted table data
  const filteredSubmittals = useMemo(() => {
    return INITIAL_SUBMITTALS.filter((item) => {
      const matchSearch =
        item.submittalId.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.packageGroup.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.assignedTo.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        item.status.toLowerCase().includes(tableSearch.toLowerCase());
      return matchSearch;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [tableSearch, sortField, sortDirection]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubmittals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmittals.map((t) => t.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (field: keyof SubmittalItem) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sparkline SVG renderer
  const renderSparkline = (color: string, pathData: string) => (
    <svg className="w-24 h-10" viewBox="0 0 100 40" fill="none">
      <path
        d={pathData}
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="space-y-6 font-['Inter',sans-serif] text-slate-800">
      {/* 1. Header Greeting Section matching reference layout with Civora context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#001237] tracking-tight font-['Encode_Sans_Condensed',sans-serif] uppercase">
              {roleHeading} &bull; Welcome, {user.name || 'Engr. Marcus Vance'}
            </h1>
            <span className="text-xl">👋</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#001237] border border-slate-200">
              {roleInfo.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {roleSubheading}
          </p>
        </div>

        {/* Date Filter Dropdown & More Menu matching reference UI */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-[#001237] shadow-2xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#4FAAA7]" />
              <span>{dateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dateDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDateDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-white border border-slate-200 shadow-lg z-40 p-1 text-xs text-slate-700 animate-fadeIn">
                  {['Today', 'Yesterday', 'Last 7 days', 'Last week', 'This month'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setDateFilter(opt);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${dateFilter === opt
                        ? 'bg-slate-100 font-semibold text-[#001237]'
                        : 'hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      <span>{opt}</span>
                      {dateFilter === opt && <Check className="w-3 h-3 text-[#4FAAA7]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="p-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-500 shadow-2xs transition-colors cursor-pointer"
            title="Dashboard options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Three KPI Cards with Sparklines in Civora Brand Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Submissions in Triage */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
              {user.role === 'project_engineer'
                ? 'Submissions in Triage'
                : 'Assigned Project Portfolios'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#4FAAA7]/10 flex items-center justify-center text-[#4FAAA7]">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#001237] tracking-tight">
              {user.role === 'project_engineer' ? '3,484' : '4'}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+7.1% vs last week</span>
            </div>
            {renderSparkline('#4FAAA7', 'M2,28 Q18,34 32,20 T62,24 T98,12')}
          </div>
        </div>

        {/* Card 2: Review Turnaround SLA */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
              {user.role === 'project_engineer'
                ? 'Daily Avg. Resolution SLA'
                : 'Latest Released Reports'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#3B68DE]/10 flex items-center justify-center text-[#3B68DE]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#001237] tracking-tight">
              {user.role === 'project_engineer' ? '486' : '8'}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+2% vs last week</span>
            </div>
            {renderSparkline('#3B68DE', 'M2,25 Q16,18 30,30 T60,16 T98,22')}
          </div>
        </div>

        {/* Card 3: Specification Compliance Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide font-['Encode_Sans_Condensed',sans-serif]">
              {user.role === 'project_engineer'
                ? 'Specification Compliance'
                : 'Overall Milestone Progress'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#001237]/10 flex items-center justify-center text-[#001237]">
              <ShieldCheck className="w-4 h-4 text-[#001237]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[#001237] tracking-tight">
              {user.role === 'project_engineer' ? '92%' : '78%'}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-500">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-1.3% vs last week</span>
            </div>
            {renderSparkline('#001237', 'M2,22 Q20,26 35,16 T65,30 T98,18')}
          </div>
        </div>
      </div>

      {/* 2.5 Field Ingestion Gateway & Identity Verification Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/submissions"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                WhatsApp Business Gateway
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                489 Ingested &bull; Active
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Live
          </span>
        </Link>

        <Link
          href="/dashboard/submissions"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Telegram Bot API Gateway
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                215 Ingested &bull; Active
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
            Live
          </span>
        </Link>

        <Link
          href="/dashboard/submissions?verificationStatus=needs_verification"
          className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 shadow-2xs hover:border-[#4FAAA7] transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#001237] text-[#4FAAA7] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-[#001237] transition-colors">
                Identity Resolution Queue
              </div>
              <div className="text-[11px] text-slate-600">
                1 Unmapped Mobile Submitter
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#001237] text-[#4FAAA7]">
            Review
          </span>
        </Link>
      </div>

      {/* 3. Middle Section: Submittal Volume Trend (~68%) + Latest Updates (~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Submittal Volume Trend Card */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#4FAAA7]" />
                <h3 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Submittal Volume & Ingestion Trend
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Last week</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>

            {/* Big Stat & Trend */}
            <div className="mt-3 flex items-baseline gap-2.5">
              <span className="text-3xl font-extrabold text-[#001237] tracking-tight">4,790</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8% vs last week</span>
              </span>
            </div>
          </div>

          {/* Bar Chart Canvas with Tuesday Highlight & Benchmark */}
          <div className="mt-8 relative pt-8 pb-2">
            {/* Horizontal Dashed Benchmark Line at 600 level */}
            <div className="absolute left-0 right-10 top-20 border-b border-dashed border-slate-300 pointer-events-none" />

            {/* Y-axis Labels on the right */}
            <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-[11px] text-slate-400 font-medium select-none font-mono">
              <span>800</span>
              <span>600</span>
              <span>400</span>
              <span>200</span>
              <span>0</span>
            </div>

            {/* 7 Columns for Days */}
            <div className="mr-10 grid grid-cols-7 gap-3 sm:gap-6 items-end h-44 relative">
              {WEEK_BARS.map((bar, idx) => {
                const isSelected = activeDayIndex === idx;

                return (
                  <div
                    key={bar.day}
                    className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onClick={() => setActiveDayIndex(idx)}
                    onMouseEnter={() => setActiveDayIndex(idx)}
                  >
                    {/* Floating Tooltip Pill for the Selected/Active bar */}
                    {isSelected && (
                      <div className="absolute -top-9 z-20 flex flex-col items-center animate-fadeIn">
                        <div className="px-2.5 py-1 rounded-md bg-[#001237] text-white text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-md">
                          {bar.day} : {bar.value}
                        </div>
                        <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#001237]" />
                      </div>
                    )}

                    {/* The Rounded Bar */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg h-full flex items-end">
                      <div
                        style={{ height: `${bar.height}%` }}
                        className={`w-full rounded-t-lg transition-all duration-200 ${isSelected
                          ? 'bg-[#001237] shadow-sm'
                          : 'bg-slate-200/80 group-hover:bg-[#4FAAA7]/50'
                          }`}
                      />
                    </div>

                    {/* Day Label below bar */}
                    <span
                      className={`text-xs mt-3 select-none ${isSelected ? 'font-bold text-[#001237]' : 'text-slate-400'
                        }`}
                    >
                      {bar.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Latest Site & Governance Updates Card */}
        <div id="activity" className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                Latest Site Updates
              </h3>
              <Layout className="w-4 h-4 text-slate-400" />
            </div>

            {/* Segmented Filter Pills in Civora Palette */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-xl text-center">
              <button
                type="button"
                onClick={() => setActivityFilter('today')}
                className={`py-1.5 text-xs rounded-lg font-bold uppercase tracking-wider transition-all ${activityFilter === 'today'
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#001237]'
                  }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('yesterday')}
                className={`py-1.5 text-xs rounded-lg font-bold uppercase tracking-wider transition-all ${activityFilter === 'yesterday'
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#001237]'
                  }`}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('week')}
                className={`py-1.5 text-xs rounded-lg font-bold uppercase tracking-wider transition-all ${activityFilter === 'week'
                  ? 'bg-[#001237] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-[#001237]'
                  }`}
              >
                This week
              </button>
            </div>

            {/* Search Input for activities */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search site activities..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7]"
              />
            </div>

            {/* Count Indicator */}
            <div className="text-xs font-semibold text-slate-600">8 new updates today</div>

            {/* Activity Stream Items matching reference layout with Civora construction events */}
            <div className="space-y-3.5 pt-1 overflow-y-auto max-h-[290px] pr-1">
              {/* Item 1: Pour Card Approved */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3B68DE] shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#001237] leading-tight">
                      Pour Card Approved
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Submittal <strong className="font-semibold text-slate-700">#SUB-2319</strong> C30/37 Deck Pour signed off
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">11:20 AM</span>
              </div>

              {/* Item 2: Contractor Accredited */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-[#4FAAA7] shrink-0 mt-0.5">
                    <UserPlus className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#001237] leading-tight">
                      Contractor Accredited
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Julius Berger EPC registered under Lagos Office
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">11:15 AM</span>
              </div>

              {/* Item 3: Lab Review Assigned */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#001237] leading-tight">
                      Lab Review Assigned
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Dangote 42.5R Batch <strong className="font-semibold text-slate-700">#SUB-2322</strong> to QA/QC Engr. Okon
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">11:00 AM</span>
              </div>

              {/* Item 4: AI Advisory Discrepancy */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#001237] leading-tight">
                      AI Advisory Flag
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Submittal <strong className="font-semibold text-slate-700">#SUB-2320</strong> Kamsteel Yield 410 vs 460 N/mm²
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">10:45 AM</span>
              </div>

              {/* Item 5: Technical Standards */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-[#4FAAA7] shrink-0 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#001237] leading-tight">
                      Technical Code Updated
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Published NIS 156:2013 / BS 8110 Spec Sheet
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">10:30 AM</span>
              </div>

              {/* Item 6: Statutory Clearance */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#008751] shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#001237] leading-tight">
                      Statutory Clearance
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      LASBCA Stage 2 Foundation Notice acknowledged
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">10:15 AM</span>
              </div>
            </div>

            {/* Link to Full Notifications Center */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Have active submittal alerts?</span>
              <Link
                href="/dashboard/notifications"
                className="inline-flex items-center gap-1 font-semibold text-[#3B68DE] hover:text-[#001237] hover:underline"
              >
                <span>All Alerts & Notifications</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#4FAAA7]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Table: Submittal Governance & SLA Monitoring matching Reference Layout */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
        {/* Table Top Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4FAAA7]" />
            <h3 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Submittal Governance & SLA Monitoring
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input matching reference UI */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search submittal or title..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-200/90 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#4FAAA7]"
              />
            </div>

            {/* Filter button */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-[#001237] shadow-2xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#4FAAA7]" />
              <span>Filter</span>
            </button>

            {/* Options button */}
            <button
              type="button"
              className="p-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-500 shadow-2xs transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table matching reference layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider select-none">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 && selectedIds.length === filteredSubmittals.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-[#001237] focus:ring-[#4FAAA7] cursor-pointer"
                  />
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('submittalId')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>Submittal ID</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>Subject / Package</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>Priority</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('assignedTo')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>Reviewer</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>Review Status</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('receivedDate')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>Received Date</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-slate-700"
                  onClick={() => handleSort('slaDue')}
                >
                  <div className="flex items-center gap-1 font-['Encode_Sans_Condensed',sans-serif]">
                    <span>SLA Due</span>
                    <span className="text-slate-300">⇅</span>
                  </div>
                </th>
                <th className="py-3 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmittals.map((row) => {
                const isChecked = selectedIds.includes(row.id);

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors hover:bg-slate-50/80 ${isChecked ? 'bg-slate-50/60' : ''
                      }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectRow(row.id)}
                        className="rounded border-slate-300 text-[#001237] focus:ring-[#4FAAA7] cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#001237]">
                      <Link
                        href={`/dashboard/submissions?id=${row.id}`}
                        className="hover:underline hover:text-[#4FAAA7] font-mono text-[11px]"
                      >
                        {row.submittalId}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 line-clamp-1">{row.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{row.packageGroup}</div>
                    </td>
                    <td className="py-3 px-3">
                      {row.priority === 'High' ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-500 font-bold">
                          <span className="text-[11px]">ıll</span>
                          <span>High</span>
                        </div>
                      ) : row.priority === 'Medium' ? (
                        <div className="inline-flex items-center gap-1.5 text-[#3B68DE] font-bold">
                          <span className="text-[11px]">ıll</span>
                          <span>Medium</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                          <span className="text-[11px]">ıll</span>
                          <span>Low</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-medium">{row.assignedTo.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      {row.status === 'In Review' ? (
                        <div className="inline-flex items-center gap-1.5 text-[#3B68DE] font-semibold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>In Review</span>
                        </div>
                      ) : row.status === 'Approved' ? (
                        <div className="inline-flex items-center gap-1.5 text-[#008751] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[#4FAAA7] font-semibold">
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#4FAAA7]/40 border-t-[#4FAAA7] animate-spin" />
                          <span>In Progress</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {row.receivedDate}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{row.slaDue}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/dashboard/submissions?id=${row.id}`}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-[#001237] inline-block"
                        title="Inspect submittal package"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
