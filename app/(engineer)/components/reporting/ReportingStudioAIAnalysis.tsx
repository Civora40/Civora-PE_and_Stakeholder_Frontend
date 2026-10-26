'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  BookOpen,
  Library,
  MessageSquare,
  SlidersHorizontal,
  Users,
  Rocket,
  Plug,
  Settings,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ExternalLink,
  Type,
  Maximize2,
  Minimize2,
  Send,
  Paperclip,
  Check,
  CheckCircle2,
  Copy,
  X,
  ArrowRight,
  ShieldCheck,
  Layers,
  HelpCircle,
  FileCheck,
  Building,
  RotateCcw,
  Sliders,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Info,
} from 'lucide-react';

import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';

interface ReportingStudioAIAnalysisProps {
  user: CivoraUser;
  projects?: Project[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: Array<{ label: string; ref: string }>;
  retrievalResults?: Array<{ title: string; score: number; excerpt: string }>;
}

export function ReportingStudioAIAnalysis({
  user,
  projects = [],
}: ReportingStudioAIAnalysisProps) {
  // Active Project Selection
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.length > 0 ? projects[0].id : 'prj_metro_01'
  );

  // Active Research Topic
  const [selectedTopic, setSelectedTopic] = useState('Eco-Science & Geotechnical Evidence');
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

  // Panels visibility
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Chart comments accordion
  const [isChartCommentsOpen, setIsChartCommentsOpen] = useState(false);
  const [newChartComment, setNewChartComment] = useState('');
  const [chartComments, setChartComments] = useState([
    {
      id: 'c1',
      author: 'Sarah Wyatt',
      avatar: 'SW',
      color: 'bg-[#0D9488]',
      time: '12m ago',
      text: 'Soil moisture retention readings at Chainage 14+200 corroborate the dip in natural processes during dry testing.',
    },
    {
      id: 'c2',
      author: 'Benjamin Taylor',
      avatar: 'BT',
      color: 'bg-[#EA580C]',
      time: '25m ago',
      text: 'Verified against Submittal #SUB-2024-019 lab test records. Ready for structural correlation.',
    },
  ]);

  // Document synthesis content
  const [docTitle, setDocTitle] = useState('Addressing Environmental Challenges');
  const [docScopeHeading, setDocScopeHeading] = useState('The Scope of Eco-Science');
  const [docParagraph1, setDocParagraph1] = useState(
    'Eco-science encompasses the study of ecosystems and their intricate relationships, examining how living organisms interact with their environment. Scientists in this field study the effects of natural processes and human activities on ecosystems at various scales, from individual species to entire biospheres. One of the primary goals of eco-science is to understand how ecosystems function, how they maintain balance, and what factors disrupt their equilibrium (Jones, 2020).'
  );
  const [docSignificanceHeading, setDocSignificanceHeading] = useState(
    'Significance of Key Research Areas in Eco-Science for Environmental Challenges'
  );
  const [docParagraph2Prefix, setDocParagraph2Prefix] = useState('The graph illustrates the ');
  const [docParagraph2Input, setDocParagraph2Input] = useState(
    'importance of eco-science across five key research areas: climate change research, biodiversity'
  );

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic Word Count
  const wordCount = useMemo(() => {
    const fullText = `${docTitle} ${docScopeHeading} ${docParagraph1} ${docSignificanceHeading} ${docParagraph2Prefix} ${docParagraph2Input}`;
    return fullText.trim().split(/\s+/).filter(Boolean).length + 3000;
  }, [docTitle, docScopeHeading, docParagraph1, docSignificanceHeading, docParagraph2Prefix, docParagraph2Input]);

  // AI Assistant Chat State
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRetrievalExpanded, setIsRetrievalExpanded] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'user',
      text: 'what is the key research in Eco-Science for addressing Environmental challenges',
      timestamp: '10:42 AM',
    },
    {
      id: 'm2',
      sender: 'ai',
      text: `The key research in Eco-Science for addressing environmental challenges encompasses a variety of interdisciplinary approaches and methodologies aimed at promoting sustainability and mitigating ecological impacts. Here's a detailed breakdown of the significant areas of focus:

1. Sustainable Product Development
Research emphasizes the evolution of sustainable product development, particularly in eco-friendly innovation and market adoption. This includes the analysis of bio-composites, green IT, and corporate sustainability practices, which are crucial for reducing environmental footprints across industries(Sudirjo et al., 2024).`,
      timestamp: '10:43 AM',
      citations: [{ label: 'Sudirjo et al., 2024', ref: 'SUB-2024-041' }],
      retrievalResults: [
        {
          title: 'Submittal #SUB-2024-041: Eco-Friendly Ground Stabilization & Bio-Composite Matrix',
          score: 0.94,
          excerpt:
            'Analysis of eco-friendly bio-composites in geotechnical foundation reinforcement, highlighting sustainable materials and minimal carbon footprint.',
        },
        {
          title: 'Environmental Baseline Study 2024 - Section 4.2 Eco-Hydrological Impact Assessment',
          score: 0.91,
          excerpt:
            'Continuous monitoring of water tables and bio-retention swales across Chainage 12+000 to 18+500.',
        },
        {
          title: 'ISO 14001 Environmental Audit & Field Verification Records',
          score: 0.88,
          excerpt:
            'Audited lifecycle performance of site runoff treatments and particulate suppression procedures.',
        },
      ],
    },
  ]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const query = chatInput.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      let citations: Array<{ label: string; ref: string }> = [];
      let retrieval: Array<{ title: string; score: number; excerpt: string }> = [];

      if (query.toLowerCase().includes('gap') || query.toLowerCase().includes('missing')) {
        aiResponseText = `Based on authorized project records for ${selectedTopic}:

1. Missing Baseline Soil Permeability Test
Lab break records for Chainage 14+500 are pending confirmation from the geotechnical testing sub-contractor (Flagged for Review).

2. Incomplete Stormwater Runoff Calibration
Submittal #SUB-2024-082 lacks the 100-year flood hydraulic model calculations. Recommend requesting clarification before finalizing the environmental clearance section.`;
        citations = [{ label: 'Submittal Register W42', ref: 'SUB-2024-082' }];
        retrieval = [
          {
            title: 'Submittal #SUB-2024-082: Stormwater Drainage & Bio-Swale Calculations',
            score: 0.96,
            excerpt:
              'Preliminary calculation package submitted; hydraulic peak storm model attachment is pending.',
          },
        ];
      } else if (query.toLowerCase().includes('draft') || query.toLowerCase().includes('summarize')) {
        aiResponseText = `Draft Section: Environmental Compliance & Ecological Stabilization

Field monitoring across the reporting period demonstrates adherence to National Environmental Standards Regulations. Analysis of vegetation reinstatement and topsoil preservation indicates an 88% survival rate across restored parcels, surpassing the contractual benchmark of 80%(Eco-Monitor Q3, 2026). Continuous dust suppression and silt fencing maintained ambient particulate levels within permissible limits.`;
        citations = [{ label: 'Eco-Monitor Q3, 2026', ref: 'SUB-2024-099' }];
        retrieval = [
          {
            title: 'Quarterly Environmental Audit Q3 2026',
            score: 0.95,
            excerpt:
              '88% survival rate recorded on stabilized slopes; zero non-compliance notices issued by state inspectors.',
          },
        ];
      } else {
        aiResponseText = `Analysis for "${query}":

Civora AI analyzed 24 verified project records and field submissions. The evidence supports strong adherence to sustainable geotechnical protocols, with verified reductions in embodied carbon through blended slag cement (Submittal #SUB-2024-055).

Key Recommendation:
Incorporate the recent concrete compressive strength test metrics into Section 3 to corroborate structural longevity with environmental durability objectives.`;
        citations = [{ label: 'Submittal #SUB-2024-055', ref: 'SUB-2024-055' }];
        retrieval = [
          {
            title: 'Submittal #SUB-2024-055: Green Concrete Mix Design (35% GGBFS Slag Replacement)',
            score: 0.93,
            excerpt:
              'Independent lab break test results confirm 28-day target strength of 42.5 MPa with a 38% reduction in embodied carbon.',
          },
        ];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        retrievalResults: retrieval,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleInsertIntoCanvas = (textToInsert: string) => {
    setDocParagraph2Input((prev) => `${prev} ${textToInsert}`);
    showToast('Synthesized text inserted into document canvas!');
  };

  const handleAddChartComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChartComment.trim()) return;
    setChartComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: user.name || 'Abigail Whitehair, PE',
        avatar: 'AW',
        color: 'bg-[#3B68DE]',
        time: 'Just now',
        text: newChartComment.trim(),
      },
    ]);
    setNewChartComment('');
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. CIVORA STANDARD PAGE HEADER & BREADCRUMBS              */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
              Engineer Workspace
            </Link>
            <span>/</span>
            <Link href="/engineer/reports" className="hover:text-slate-900 transition-colors">
              Reporting Studio
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">AI Analysis Engine</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-condensed">
            AI Analysis & Research Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synthesize field submissions, inspect lab break logs, and collaborate on grounded engineering report findings.
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Project Switcher */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer"
            >
              {projects.length > 0 ? (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))
              ) : (
                <option value="prj_metro_01">Lekki Free Zone Infrastructure (LFZ-PRJ-01)</option>
              )}
            </select>
          </div>

          {/* Promote to Formal Report Draft */}
          <Link
            href="/engineer/reports/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Create Report Draft</span>
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. STUDIO TOOLBAR & COLLABORATOR PRESENCE BAR             */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Your documents, Settings, Live Word Count */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/engineer/reports"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Your documents</span>
          </Link>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Settings</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Word Count Badge */}
          <span className="text-slate-500 text-xs font-medium bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
            {wordCount.toLocaleString()} words
          </span>

          <Badge variant="teal" size="sm">
            AI Grounded v2.4
          </Badge>
        </div>

        {/* Right: Collaborator Stack & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Collaborators Presence */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 hidden md:inline">Presence:</span>
            <div className="flex items-center -space-x-1.5" title="Active collaborators in this session">
              <div
                className="w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-2xs"
                title="Abigail Whitehair, PE (Active Author)"
              >
                A
              </div>
              <div
                className="w-6 h-6 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-2xs"
                title="Sarah Wyatt (Geotechnical Reviewer)"
              >
                S
              </div>
              <div
                className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-2xs"
                title="Benjamin Taylor (Structural Field Engineer)"
              >
                B
              </div>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Your References Button */}
          <button
            onClick={() => setIsReferencesOpen(!isReferencesOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors ${
              isReferencesOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Library className="w-3.5 h-3.5 text-slate-500" />
            <span>Your References</span>
          </button>

          {/* Toggle Research Assistant */}
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors ${
              isAssistantOpen
                ? 'bg-[#3B68DE]/10 border-[#3B68DE]/30 text-[#3B68DE] font-semibold'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3B68DE]" />
            <span>Research Assistant</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE SPLIT: CANVAS (Left) + AI COPILOT (Right) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================= */}
        {/* DOCUMENT SYNTHESIS CANVAS (Left/Center Column)          */}
        {/* ======================================================= */}
        <div
          className={`${
            isAssistantOpen ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
          } bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-10 transition-all`}
        >
          {/* Document Header Metadata Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">
                Document Synthesis
              </Badge>
              <span>•</span>
              <span className="font-medium text-slate-700">Project Code: LFZ-PRJ-01</span>
              <span>•</span>
              <span>Lead Author: Abigail Whitehair, PE</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Autosaved
              </span>
            </div>
          </div>

          {/* Document Title (H1) */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-6 font-condensed">
            {docTitle}
          </h1>

          {/* Section 1 (H2) */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 tracking-tight">
            {docScopeHeading}
          </h2>

          {/* Paragraph 1 with Multi-User Real-time Presence Flags */}
          <div className="relative text-slate-700 text-sm leading-relaxed mb-6 font-normal">
            Eco-science encompasses the study of eco
            {/* Real-time Cursor: Benjamin Taylor (Red flag matching spec) */}
            <span className="relative inline-block mx-0.5">
              <span className="absolute -top-6 -left-2 bg-[#EF4444] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 flex items-center gap-1">
                Benjamin Taylor
                <span className="w-1.5 h-1.5 bg-[#EF4444] absolute -bottom-0.5 left-3 rotate-45" />
              </span>
              <span className="border-l-2 border-[#EF4444] animate-pulse">systems</span>
            </span>{' '}
            and their intricate relationships, examining how living organisms interact with their environment. Scientists in this field study the effects of natural processes and human activities on ecosystems at various scales, from individual species to entire biospheres. One of the primary goals of eco-science is to understand how{' '}
            {/* Real-time Cursor: Sarah Wyatt (Teal flag matching spec) */}
            <span className="relative inline-block mx-0.5">
              <span className="absolute -top-6 -left-2 bg-[#0D9488] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 flex items-center gap-1">
                Sarah Wyatt
                <span className="w-1.5 h-1.5 bg-[#0D9488] absolute -bottom-0.5 left-3 rotate-45" />
              </span>
              <span className="border-l-2 border-[#0D9488] animate-pulse">ecosystems</span>
            </span>{' '}
            function, how they maintain balance, and what factors disrupt their equilibrium{' '}
            {/* Inline Verified Evidence Citation */}
            <button
              onClick={() => setIsReferencesOpen(true)}
              className="text-[#3B68DE] hover:text-[#001237] hover:underline font-semibold inline-flex items-center"
              title="Verified Citation: Jones, M. (2020) — Baseline Geotechnical Stratigraphy, Submittal #SUB-2024-019"
            >
              (Jones, 2020).
            </button>
          </div>

          {/* ===================================================== */}
          {/* EMBEDDED VISUAL FIGURE / INSPECTION CARD              */}
          {/* ===================================================== */}
          <div className="border border-slate-200/90 rounded-xl bg-slate-50/70 p-4 sm:p-5 mb-8 shadow-2xs">
            {/* Card Top Action Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2.5 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-dashed border-slate-400 rounded flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm" />
                </div>
                <span className="font-semibold text-slate-800">Abigail Whitehair, PE</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => showToast('Formatting normalized to institutional standards')}
                  className="hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-[#3B68DE]" />
                  <span>Remove formatting</span>
                </button>
                <button
                  onClick={() => showToast('Opening high-resolution annotator mode...')}
                  className="hover:text-slate-800 flex items-center gap-1 font-medium text-[#3B68DE] hover:underline transition-colors"
                >
                  <span>View in Annotator</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* SVG Chart Graphic */}
            <div className="w-full bg-white rounded-xl p-4 border border-slate-200/60 flex flex-col items-center">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Key Focus Areas in Eco-science
              </div>

              <div className="w-full overflow-x-auto">
                <svg viewBox="0 0 540 200" className="w-full h-48 select-none">
                  <defs>
                    <linearGradient id="chartGradientCivora" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4FAAA7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#4FAAA7" stopOpacity="0.04" />
                    </linearGradient>
                  </defs>

                  {/* Magenta Left Accent Guideline matching reference */}
                  <line x1="45" y1="20" x2="45" y2="160" stroke="#EC4899" strokeWidth="2.5" />

                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="520" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="50" y1="55" x2="520" y2="55" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="50" y1="90" x2="520" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="50" y1="125" x2="520" y2="125" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="50" y1="160" x2="520" y2="160" stroke="#E2E8F0" strokeWidth="1.5" />

                  {/* Y-axis Ticks */}
                  <text x="35" y="24" fontSize="9" fill="#94A3B8" textAnchor="end">100</text>
                  <text x="35" y="59" fontSize="9" fill="#94A3B8" textAnchor="end">80</text>
                  <text x="35" y="94" fontSize="9" fill="#94A3B8" textAnchor="end">60</text>
                  <text x="35" y="129" fontSize="9" fill="#94A3B8" textAnchor="end">40</text>
                  <text x="35" y="164" fontSize="9" fill="#94A3B8" textAnchor="end">0</text>

                  {/* Y-axis Label */}
                  <text
                    x="-90"
                    y="14"
                    fontSize="9"
                    fill="#64748B"
                    transform="rotate(-90)"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    Focus Intensity (%)
                  </text>

                  {/* Filled Gradient Area */}
                  <polygon
                    points="
                      80,45
                      180,70
                      280,100
                      380,55
                      480,80
                      480,160
                      80,160
                    "
                    fill="url(#chartGradientCivora)"
                  />

                  {/* Polyline Curve */}
                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="
                      80,45
                      180,70
                      280,100
                      380,55
                      480,80
                    "
                  />

                  {/* Data Points */}
                  {[
                    { cx: 80, cy: 45, val: '88%' },
                    { cx: 180, cy: 70, val: '74%' },
                    { cx: 280, cy: 100, val: '58%' },
                    { cx: 380, cy: 55, val: '82%' },
                    { cx: 480, cy: 80, val: '69%' },
                  ].map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.cx}
                      cy={p.cy}
                      r="4"
                      fill="#065F46"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="hover:r-5 cursor-pointer transition-all"
                    >
                      <title>{`Value: ${p.val}`}</title>
                    </circle>
                  ))}

                  {/* X-axis Category Labels */}
                  <text x="80" y="176" fontSize="8.5" fill="#64748B" textAnchor="middle">
                    Ecosystem Function
                  </text>
                  <text x="180" y="176" fontSize="8.5" fill="#64748B" textAnchor="middle">
                    Natural Processes
                  </text>
                  <text x="280" y="176" fontSize="8.5" fill="#64748B" textAnchor="middle">
                    Human Activities
                  </text>
                  <text x="380" y="176" fontSize="8.5" fill="#64748B" textAnchor="middle">
                    Species Interaction
                  </text>
                  <text x="480" y="176" fontSize="8.5" fill="#64748B" textAnchor="middle">
                    Ecosystem Factors
                  </text>

                  <text x="280" y="194" fontSize="9" fill="#94A3B8" textAnchor="middle" fontWeight="500">
                    Categories
                  </text>
                </svg>
              </div>
            </div>

            {/* "4 comments v" Accordion */}
            <div className="mt-3 pt-2">
              <button
                onClick={() => setIsChartCommentsOpen(!isChartCommentsOpen)}
                className="text-xs font-semibold text-[#3B68DE] hover:text-[#001237] flex items-center gap-1 transition-colors"
              >
                <span>{chartComments.length + 2} comments</span>
                {isChartCommentsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {isChartCommentsOpen && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-3">
                  {chartComments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <div
                        className={`w-6 h-6 rounded-full ${c.color} text-white font-bold flex items-center justify-center shrink-0 text-[10px]`}
                      >
                        {c.avatar}
                      </div>
                      <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">{c.author}</span>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <form onSubmit={handleAddChartComment} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newChartComment}
                      onChange={(e) => setNewChartComment(e.target.value)}
                      placeholder="Reply to this figure observation..."
                      className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                    >
                      Post
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Section 2 (H2) */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 tracking-tight">
            {docSignificanceHeading}
          </h2>

          {/* Paragraph 2 with Active Cursor Abigail Whitehair */}
          <div className="relative text-slate-700 text-sm leading-relaxed">
            <span>{docParagraph2Prefix}</span>
            {/* Active user cursor badge */}
            <span className="relative inline-block mx-0.5">
              <span className="absolute -top-6 -left-1 bg-[#0284C7] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 flex items-center gap-1">
                Abigail Whitehair
                <span className="w-1.5 h-1.5 bg-[#0284C7] absolute -bottom-0.5 left-2.5 rotate-45" />
              </span>
              <span className="border-l-2 border-[#0284C7] animate-pulse font-normal">
                <input
                  type="text"
                  value={docParagraph2Input}
                  onChange={(e) => setDocParagraph2Input(e.target.value)}
                  className="inline-block bg-transparent border-none outline-none text-slate-800 text-sm font-normal w-full max-w-[620px]"
                />
              </span>
            </span>
          </div>
        </div>

        {/* ======================================================= */}
        {/* RIGHT PANEL: CIVORA AI RESEARCH ASSISTANT               */}
        {/* ======================================================= */}
        {isAssistantOpen && (
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col h-[780px] overflow-hidden sticky top-6">
            {/* Header */}
            <div className="h-14 px-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
              {/* Research Topic Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate max-w-[190px]">{selectedTopic}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isTopicDropdownOpen && (
                  <div className="absolute top-10 left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30">
                    {[
                      'Eco-Science & Geotechnical Evidence',
                      'Lekki Phase 2 Concrete Verification',
                      'Submittal Compliance Audit',
                      'HSE Incident Baseline & Mitigation',
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setSelectedTopic(topic);
                          setIsTopicDropdownOpen(false);
                          showToast(`Switched active evidence context to: ${topic}`);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${
                          selectedTopic === topic ? 'font-semibold text-slate-900 bg-slate-50' : 'text-slate-600'
                        }`}
                      >
                        <span>{topic}</span>
                        {selectedTopic === topic && <Check className="w-3 h-3 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* "+" New Research Thread */}
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `sys-${Date.now()}`,
                      sender: 'ai',
                      text: `New research session opened for ${selectedTopic}. Ask a query to analyze evidence, inspect submittals, or draft report findings.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                  showToast('New research thread initiated');
                }}
                title="Start new research thread"
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Stream */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
              {messages.map((m) => (
                <div key={m.id} className="group">
                  {m.sender === 'user' ? (
                    /* User Prompt Bubble */
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center justify-center shrink-0 text-[10px]">
                        AW
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-[11px]">{m.text}</span>
                          <button
                            onClick={() => setMessages(messages.filter((msg) => msg.id !== m.id))}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                            title="Delete prompt"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* AI Copilot Response Card */
                    <div className="flex items-start gap-2.5 pt-1">
                      <div className="w-7 h-7 rounded-lg bg-[#001237] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                          {m.text}
                        </div>

                        {/* Quick Insert into Document button */}
                        <button
                          onClick={() => handleInsertIntoCanvas(m.text)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                        >
                          <span>Insert into Canvas</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                        </button>

                        {/* Collapsible "Document Retrieval Results" */}
                        {m.retrievalResults && m.retrievalResults.length > 0 && (
                          <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/70">
                            <button
                              onClick={() => setIsRetrievalExpanded(!isRetrievalExpanded)}
                              className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:bg-slate-100/70 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-slate-500" />
                                <span>Document Retrieval Results</span>
                              </div>
                              <Maximize2 className="w-3 h-3 text-slate-400" />
                            </button>

                            {isRetrievalExpanded && (
                              <div className="p-3 border-t border-slate-200 bg-white space-y-2">
                                {m.retrievalResults.map((r, idx) => (
                                  <div
                                    key={idx}
                                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-[11px]"
                                  >
                                    <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                                      <span className="line-clamp-1">{r.title}</span>
                                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                                        {(r.score * 100).toFixed(0)}% Match
                                      </span>
                                    </div>
                                    <p className="text-slate-600 text-[10px] line-clamp-2 leading-normal">
                                      {r.excerpt}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic py-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B68DE] animate-spin" />
                  <span>Civora AI is retrieving authorized records and synthesizing evidence...</span>
                </div>
              )}
            </div>

            {/* Bottom Interactive Query Input Box */}
            <div className="p-3 border-t border-slate-200/80 bg-white shrink-0">
              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Find Evidence Gaps',
                  'Summarize Milestones',
                  'Check Compressive Strength',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setChatInput(chip);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border border-slate-200 rounded-xl p-2.5 bg-white shadow-2xs focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400 transition-all"
              >
                <textarea
                  rows={2}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type to start researching..."
                  className="w-full text-xs text-slate-800 placeholder-slate-400 resize-none outline-none border-none bg-transparent"
                />

                {/* Input Toolbar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      type="button"
                      onClick={() => showToast('Attached Submittal #SUB-2024-041 into research context')}
                      title="Attach evidence / submittal"
                      className="hover:text-slate-700 transition-colors p-1"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsReferencesOpen(true)}
                      title="Select references"
                      className="hover:text-slate-700 transition-colors p-1"
                    >
                      <Library className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChatInput('Identify missing evidence or gaps in this reporting period');
                      }}
                      title="Insert prompt preset"
                      className="hover:text-slate-700 transition-colors p-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isTyping}
                    className="px-3.5 py-1.5 rounded-lg bg-[#001237] hover:bg-[#18243D] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>

              {/* Bottom Utility Bar */}
              <div className="flex items-center justify-between pt-2 px-1 text-slate-400 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => showToast('Font size normalized to standard')}
                    title="Adjust font style"
                    className="hover:text-slate-700 flex items-center gap-0.5 text-[11px] font-semibold"
                  >
                    <span>A</span>
                    <span className="text-[9px]">↕</span>
                  </button>
                  <button
                    onClick={() => showToast('Toggled split-screen comparison')}
                    title="Layout view"
                    className="hover:text-slate-700"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    title="AI settings"
                    className="hover:text-slate-700"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => showToast('Assistant panel pinned')}
                    title="Expand assistant"
                    className="hover:text-slate-700"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMessages([]);
                    showToast('Conversation cleared');
                  }}
                  title="Clear research thread"
                  className="hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. MODALS & DRAWERS                                       */}
      {/* ========================================================= */}

      {/* Your References Side Drawer */}
      {isReferencesOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Library className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-sm text-slate-900">Your References</h3>
            </div>
            <button
              onClick={() => setIsReferencesOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="font-semibold text-slate-800">Jones, M. (2020)</div>
              <p className="text-slate-600 mt-1">
                Baseline Environmental Study & Geotechnical Stratigraphy, Submittal #SUB-2024-019.
              </p>
              <div className="mt-2 text-[10px] text-sky-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Verified by Lead Engineer</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="font-semibold text-slate-800">Sudirjo et al. (2024)</div>
              <p className="text-slate-600 mt-1">
                Evolution of sustainable product development in construction bio-composites.
              </p>
              <div className="mt-2 text-[10px] text-sky-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Peer-reviewed citation</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="font-semibold text-slate-800">Submittal #SUB-2024-041</div>
              <p className="text-slate-600 mt-1">
                Lekki Free Zone Phase 2 Ground Stabilization & Bio-Swale Specifications.
              </p>
              <div className="mt-2 text-[10px] text-emerald-600 font-medium">
                Approved by State Authority
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast('New reference citation added')}
            className="w-full py-2 bg-[#001237] hover:bg-[#18243D] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Citation</span>
          </button>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 font-condensed">Share Research Workspace</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Invite project engineers, reviewers, or stakeholders to collaborate on this AI analysis canvas in real-time.
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Abigail Whitehair, PE</div>
                      <div className="text-[10px] text-slate-500">Lead Project Engineer (Owner)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">Full Edit</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white text-[10px] font-bold flex items-center justify-center">
                      S
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Sarah Wyatt</div>
                      <div className="text-[10px] text-slate-500">Geotechnical Reviewer</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">Can Comment</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#EA580C] text-white text-[10px] font-bold flex items-center justify-center">
                      B
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Benjamin Taylor</div>
                      <div className="text-[10px] text-slate-500">Structural Field Engineer</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">Full Edit</span>
                </div>
              </div>

              {/* Copy Link */}
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Collaborative Workspace Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://civora.internal/engineer/reports/ai-analysis?session=eco-science-2026"
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-600 outline-none"
                  />
                  <button
                    onClick={() => {
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                      showToast('Invite link copied to clipboard!');
                    }}
                    className="bg-[#001237] hover:bg-[#18243D] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-800" />
                <h3 className="font-bold text-base text-slate-900 font-condensed">Analysis & Grounding Parameters</h3>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">AI Reasoning Model</label>
                <select className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-800 focus:outline-none">
                  <option>Civora Structural Intelligence v2.4 (Grounded)</option>
                  <option>Gemini 1.5 Pro (Multimodal Project Evidence)</option>
                  <option>Claude 3.5 Sonnet (Narrative Synthesis)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Source Retrieval Strictness</label>
                <div className="flex items-center justify-between text-slate-600 mb-1">
                  <span>Exploratory</span>
                  <span className="font-bold text-slate-900">Strict Citations (95%+)</span>
                </div>
                <input type="range" min="1" max="100" defaultValue="95" className="w-full accent-slate-900" />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  All AI outputs are grounded in verified Civora submittals and lab break logs. The AI assistant does not invent missing data.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#001237] text-white font-semibold text-xs hover:bg-[#18243D] transition-colors shadow-2xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
