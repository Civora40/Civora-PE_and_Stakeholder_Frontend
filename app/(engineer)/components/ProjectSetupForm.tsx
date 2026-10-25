'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Clock,
  Send,
  Save,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ProjectSetupFormProps {
  user: CivoraUser;
}

interface MilestoneItem {
  id: string;
  title: string;
  targetDate: string;
}

const PROJECT_TYPES = [
  'Road / Highway',
  'Bridge & Overpass',
  'Building & Facilities',
  'Water, Ports & Drainage',
  'Power & Utilities',
  'Rail & Mass Transit',
  'Public Infrastructure & Civil Works',
  'Other',
];

const CURRENCIES = [
  { symbol: '₦', label: 'NGN (₦)' },
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
];

const SAMPLE_CLIENTS = [
  'Federal Ministry of Works & Housing (FMWH)',
  'Lagos State Ministry of Works and Infrastructure',
  'Lagos Metropolitan Area Transport Authority (LAMATA)',
  'Federal Capital Development Authority (FCDA Abuja)',
  'Nigerian Ports Authority (NPA)',
  'South Energyx Nigeria Ltd',
  'State Department of Transportation',
];

const SAMPLE_CONTRACTORS = [
  'Julius Berger Nigeria Plc',
  'CCECC Nigeria Ltd',
  'Arab Contractors Ltd',
  'Reynolds Construction Company (RCC)',
  'Setraco Nigeria Ltd',
  'Dantata & Sawoe Construction',
];

const NIGERIAN_STATES = [
  'Lagos', 'Abuja FCT', 'Rivers', 'Ogun', 'Kano', 'Kaduna', 'Oyo', 'Edo',
  'Delta', 'Enugu', 'Anambra', 'Akwa Ibom', 'Ondo', 'Kwara', 'Plateau', 'Other',
];

export function ProjectSetupForm({ user }: ProjectSetupFormProps) {
  const router = useRouter();

  // Active step: 1 (Basics), 2 (Location & Scope), 3 (Team), 4 (Governance), 5 (Review)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  // Step 1: Basics
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [contractRef, setContractRef] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('normal');

  // Step 2: Location & Scope
  const [country, setCountry] = useState('Nigeria');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [currency, setCurrency] = useState('₦');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [scopeSummary, setScopeSummary] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([
    'Sub-grade stabilization and earthworks',
    'Reinforced concrete drainage and culverts',
  ]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [milestonesList, setMilestonesList] = useState<MilestoneItem[]>([
    { id: 'ms-1', title: 'Site Mobilization & Survey Pegging', targetDate: '' },
    { id: 'ms-2', title: 'Sub-base Compaction & QA Verification', targetDate: '' },
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');
  const [constraints, setConstraints] = useState('');

  // Step 3: Team & Responsibilities
  const [leadEngineer, setLeadEngineer] = useState(user.name || 'Marcus Vance, PE (COREN Reg.)');
  const [clientRep, setClientRep] = useState('');
  const [contractor, setContractor] = useState(SAMPLE_CONTRACTORS[0]);
  const [escalationContact, setEscalationContact] = useState('');
  const [stakeholdersInput, setStakeholdersInput] = useState('State Infrastructure Oversight Committee, Community Liaison Unit');
  const [assignedTeamInput, setAssignedTeamInput] = useState('Site QA/QC Engineer, HSE Lead Officer, Resident Materials Engineer');

  // Step 4: Reporting & Governance
  const [reportingCadence, setReportingCadence] = useState('daily');
  const [submissionChannels, setSubmissionChannels] = useState<string[]>(['whatsapp', 'portal']);
  const [reportingCategories, setReportingCategories] = useState<string[]>([
    'Progress & Chainage',
    'Workforce & Equipment',
    'Materials & Deliveries',
    'Health & Safety (HSE)',
    'Quality & QA Evidence',
  ]);
  const [reviewOwner, setReviewOwner] = useState(user.name || 'Lead Project Engineer');
  const [stakeholderReviewRequired, setStakeholderReviewRequired] = useState(true);
  const [requireLabBreakCert, setRequireLabBreakCert] = useState(true);
  const [requireGeotaggedPhotos, setRequireGeotaggedPhotos] = useState(true);
  const [governanceNotes, setGovernanceNotes] = useState(
    'All concrete pour submissions must attach 7-day and 28-day laboratory compressive strength certificates before progress sign-off.'
  );

  // Auto-generate project code helper
  const generateProjectCode = () => {
    const prefix = name
      ? name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .slice(0, 4)
      : 'CIV';
    const randomNum = Math.floor(100 + Math.random() * 900);
    setCode(`${prefix || 'PRJ'}-${randomNum}`);
  };

  // Deliverables management
  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable('');
    }
  };
  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  // Milestones management
  const addMilestone = () => {
    if (newMilestoneTitle.trim()) {
      setMilestonesList([
        ...milestonesList,
        {
          id: `ms-${Date.now()}`,
          title: newMilestoneTitle.trim(),
          targetDate: newMilestoneDate || '',
        },
      ]);
      setNewMilestoneTitle('');
      setNewMilestoneDate('');
    }
  };
  const removeMilestone = (id: string) => {
    setMilestonesList(milestonesList.filter((m) => m.id !== id));
  };

  // Toggle channel
  const toggleChannel = (channel: string) => {
    if (submissionChannels.includes(channel)) {
      setSubmissionChannels(submissionChannels.filter((c) => c !== channel));
    } else {
      setSubmissionChannels([...submissionChannels, channel]);
    }
  };

  // Toggle category
  const toggleCategory = (cat: string) => {
    if (reportingCategories.includes(cat)) {
      setReportingCategories(reportingCategories.filter((c) => c !== cat));
    } else {
      setReportingCategories([...reportingCategories, cat]);
    }
  };

  // Section Validation status
  const stepValidation = useMemo(() => {
    const basicsValid = Boolean(name.trim() && code.trim() && client.trim() && description.trim());
    const locationValid = Boolean(
      country.trim() &&
      state.trim() &&
      city.trim() &&
      siteAddress.trim() &&
      startDate &&
      completionDate &&
      new Date(completionDate) >= new Date(startDate) &&
      scopeSummary.trim()
    );
    const teamValid = Boolean(leadEngineer.trim() && contractor.trim());
    const governanceValid = Boolean(reportingCadence && submissionChannels.length > 0 && reviewOwner.trim());

    return {
      1: basicsValid,
      2: locationValid,
      3: teamValid,
      4: governanceValid,
      allReady: basicsValid && locationValid && teamValid && governanceValid,
    };
  }, [
    name,
    code,
    client,
    description,
    country,
    state,
    city,
    siteAddress,
    startDate,
    completionDate,
    scopeSummary,
    leadEngineer,
    contractor,
    reportingCadence,
    submissionChannels,
    reviewOwner,
  ]);

  // Submit Handler
  const handleSubmit = async (targetStatus: 'active' | 'planning') => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Guard on basics
    if (!name.trim() || !code.trim() || !client.trim()) {
      setErrorMessage('Please fill in required fields: Project Name, Code, and Client.');
      setCurrentStep(1);
      return;
    }

    if (startDate && completionDate && new Date(completionDate) < new Date(startDate)) {
      setErrorMessage('Planned completion date cannot be earlier than start date.');
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        code,
        projectType,
        description,
        client,
        contractRef,
        priority,
        status: targetStatus,
        country,
        state,
        city,
        siteAddress,
        coordinates,
        startDate,
        completionDate,
        currency,
        budgetAmount: budgetAmount ? `${budgetAmount}M` : '0',
        scopeSummary,
        deliverables,
        milestonesList,
        constraints,
        leadEngineer,
        clientRep,
        contractor,
        escalationContact,
        stakeholders: stakeholdersInput.split(',').map((s) => s.trim()).filter(Boolean),
        assignedTeam: assignedTeamInput.split(',').map((t) => t.trim()).filter(Boolean),
        reportingCadence,
        submissionChannels,
        reportingCategories,
        stakeholderReviewRequired,
        requireLabBreakCert,
        requireGeotaggedPhotos,
        governanceNotes,
        specsReference: 'FMWH Civil Infrastructure Standard & BS 8110 (Eurocode 2)',
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize project.');
      }

      setSuccessMessage(
        targetStatus === 'active'
          ? `Project ${code} (${name}) has been provisioned and authorized for active monitoring!`
          : `Draft saved successfully for project ${code}. Status set to Pending Setup.`
      );

      // Redirect after brief visual feedback
      setTimeout(() => {
        router.push('/dashboard/projects');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while creating the project.');
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Basics', desc: 'Identity & Sector' },
    { num: 2, title: 'Location & Scope', desc: 'Site, Dates & Budget' },
    { num: 3, title: 'Team', desc: 'Engineers & Contractor' },
    { num: 4, title: 'Governance', desc: 'Cadence & Standards' },
    { num: 5, title: 'Review & Create', desc: 'Summary & Launch' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-['Inter',sans-serif]">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Projects Directory
            </Link>
            <span className="text-slate-300">/</span>
            <Badge variant="slate" size="sm">Provisioning Workflow</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Create a New Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Set up your project details, delivery scope, team, and reporting requirements. You can save a draft and complete it later.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit('planning')}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4 text-slate-500" />}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="teal"
            size="sm"
            onClick={() => {
              if (currentStep < 5) {
                setCurrentStep(5);
              } else {
                handleSubmit('active');
              }
            }}
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {currentStep === 5 ? 'Authorize & Create' : 'Review & Finalize'}
          </Button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-3 sm:p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] gap-2">
          {stepsList.map((step, idx) => {
            const isActive = currentStep === step.num;
            const isCompleted = (stepValidation as any)[step.num] && currentStep > step.num;
            const isStepValid = (stepValidation as any)[step.num];

            return (
              <React.Fragment key={step.num}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-[#001237] text-white shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isActive
                        ? 'bg-[#4FAAA7] text-[#001237]'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold leading-tight truncate">
                      {step.title}
                    </div>
                    <div
                      className={`text-[10px] leading-tight truncate ${
                        isActive ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {step.desc}
                    </div>
                  </div>
                </button>
                {idx < stepsList.length - 1 && (
                  <div className="h-0.5 w-6 bg-slate-200 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Feedback Alerts */}
      {errorMessage && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Validation Warning: </span>
            {errorMessage}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 flex items-start gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Success: </span>
            {successMessage}
          </div>
        </div>
      )}

      {/* Main Form & Sticky Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Main Area (Left Column) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1: PROJECT BASICS */}
          {currentStep === 1 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#4FAAA7] text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  Section A
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Project Basics & Identity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define the core identity, regulatory reference, sector, and contract classification.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>
                      Project Name <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">Clear human-readable title</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lagos Rail Mass Transit (Blue Line) — Viaduct & Station"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>

                {/* Project Code & Generator */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 flex items-center justify-between">
                      <span>
                        Project Code / Identifier <span className="text-rose-500">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={generateProjectCode}
                        className="text-[11px] font-semibold text-[#3B68DE] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-suggest
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. LAMATA-BL2"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 font-mono text-slate-900 uppercase focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Project Type / Sector <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Client / Sponsoring Organization */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>
                      Client / Sponsoring Organization <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">Government body or sponsor</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="sample-clients"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Lagos Metropolitan Area Transport Authority (LAMATA)"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                  <datalist id="sample-clients">
                    {SAMPLE_CLIENTS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                {/* Contract Reference & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Contract / Procurement Reference
                    </label>
                    <input
                      type="text"
                      value={contractRef}
                      onChange={(e) => setContractRef(e.target.value)}
                      placeholder="e.g. FMWH/FED/2026/088-C"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">Operational Priority</label>
                    <div className="grid grid-cols-4 gap-2 pt-0.5">
                      {(['low', 'normal', 'high', 'critical'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPriority(lvl)}
                          className={`py-2 rounded-xl text-center font-bold uppercase text-[10px] tracking-wider border transition-all cursor-pointer ${
                            priority === lvl
                              ? lvl === 'critical'
                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                : lvl === 'high'
                                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                : lvl === 'low'
                                ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                                : 'bg-[#001237] text-white border-[#001237] shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>
                      Project Scope & Description <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Engineering objective and deliverables
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive technical description of the infrastructure project, civil scope boundaries, and primary expected engineering outcomes..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors resize-y"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  href="/dashboard/projects"
                >
                  Discard & Exit
                </Button>
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => setCurrentStep(2)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Location & Scope
                </Button>
              </div>
            </div>
          )}

          {/* SECTION 2: LOCATION & SCOPE */}
          {currentStep === 2 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#4FAAA7] text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  Section B
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Location, Timeline & Delivery Scope
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specify site geographic boundaries, schedule milestones, and financial authorization.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Country, State, City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Country <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Nigeria"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      State / Region <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      list="state-list"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                    <datalist id="state-list">
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      City / LGA <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lagos Island / Marina"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Site Address & Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Site Physical Address / Corridor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      placeholder="e.g. Marina to Mile 2 Rail Corridor, Outer Marina, Lagos"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      GPS Coordinates (Lat / Long)
                    </label>
                    <input
                      type="text"
                      value={coordinates}
                      onChange={(e) => setCoordinates(e.target.value)}
                      placeholder="e.g. 6.4531° N, 3.3958° E"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 font-mono text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Dates & Authorized Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Planned Start Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Target Completion Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={completionDate}
                      min={startDate || undefined}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Authorized Budget (in Millions)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none font-bold"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.symbol} value={c.symbol}>
                            {c.symbol}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        placeholder="e.g. 64.8"
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Scope Summary */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>
                      Detailed Scope Boundaries <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Physical chainage, structures, and limits
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={scopeSummary}
                    onChange={(e) => setScopeSummary(e.target.value)}
                    placeholder="e.g. Construction of dual elevated guideway viaduct from Chainage 0+000 to 13+000, 5 intermediate passenger stations, and maintenance depot..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>

                {/* Repeatable Key Deliverables */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Key Engineering Deliverables</span>
                    <span className="text-[11px] font-normal text-slate-400">Dynamic tracking items</span>
                  </label>
                  <div className="space-y-2">
                    {deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                      >
                        <span className="text-xs font-medium flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-mono">
                            {idx + 1}
                          </span>
                          {item}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDeliverable(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove deliverable"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newDeliverable}
                        onChange={(e) => setNewDeliverable(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addDeliverable();
                          }
                        }}
                        placeholder="Add deliverable (e.g. Foundation pile load testing 1500kN)..."
                        className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={addDeliverable}
                        variant="outline"
                        size="sm"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Repeatable Major Milestones */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Major Schedule Milestones</span>
                    <span className="text-[11px] font-normal text-slate-400">Target delivery milestones</span>
                  </label>
                  <div className="space-y-2">
                    {milestonesList.map((ms) => (
                      <div
                        key={ms.id}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#4FAAA7]" />
                          <span className="font-medium text-slate-800">{ms.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-slate-500">
                            {ms.targetDate || 'Date TBD'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMilestone(ms.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            aria-label="Remove milestone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        placeholder="Milestone title (e.g. Pier Cap Hydro-demolition)..."
                        className="sm:col-span-8 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 text-xs focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                      />
                      <input
                        type="date"
                        value={newMilestoneDate}
                        onChange={(e) => setNewMilestoneDate(e.target.value)}
                        className="sm:col-span-3 rounded-xl bg-slate-50 border border-slate-200 px-2 py-2 text-slate-900 text-xs focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={addMilestone}
                        variant="outline"
                        size="sm"
                        className="sm:col-span-1"
                      >
                        <Plus className="w-3.5 h-3.5 mx-auto" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Constraints & Dependencies */}
                <div className="space-y-1.5 pt-2">
                  <label className="font-bold text-slate-800">
                    Site Constraints, Access & Environmental Dependencies
                  </label>
                  <textarea
                    rows={2}
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="e.g. Tidal work windows for coastal revetment; LASTMA traffic diversion permits required for daytime highway lane closures..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous: Basics
                </Button>
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => setCurrentStep(3)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Team & Responsibilities
                </Button>
              </div>
            </div>
          )}

          {/* SECTION 3: TEAM & RESPONSIBILITIES */}
          {currentStep === 3 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#4FAAA7] text-xs font-bold uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  Section C
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Project Leadership & Partner Organizations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designate engineer oversight, main contractor, client contact, and stakeholder parties.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Lead Project Engineer */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>
                      Lead Project Engineer / Authority Owner <span className="text-rose-500">*</span>
                    </span>
                    <Badge variant="teal" size="sm">Current User</Badge>
                  </label>
                  <input
                    type="text"
                    required
                    value={leadEngineer}
                    onChange={(e) => setLeadEngineer(e.target.value)}
                    placeholder="e.g. Marcus Vance, PE (COREN Reg.)"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 font-semibold focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-500">
                    Lead engineer possesses supervisory sign-off authority and field review delegation for all incoming WhatsApp/Telegram submittals.
                  </p>
                </div>

                {/* Primary Contractor & Client Rep */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Primary Civil Contractor / Delivery Partner <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      list="contractor-list"
                      value={contractor}
                      onChange={(e) => setContractor(e.target.value)}
                      placeholder="e.g. Julius Berger Nigeria Plc"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                    <datalist id="contractor-list">
                      {SAMPLE_CONTRACTORS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Client Designated Representative
                    </label>
                    <input
                      type="text"
                      value={clientRep}
                      onChange={(e) => setClientRep(e.target.value)}
                      placeholder="e.g. Engr. O. Babatunde (Director of Civil Works)"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Assigned Site Team Roles */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Assigned Field Disciplines / Site Roles</span>
                    <span className="text-[11px] font-normal text-slate-400">Comma-separated</span>
                  </label>
                  <input
                    type="text"
                    value={assignedTeamInput}
                    onChange={(e) => setAssignedTeamInput(e.target.value)}
                    placeholder="e.g. Site QA/QC Engineer, HSE Lead Officer, Resident Materials Engineer"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                  <p className="text-[11px] text-slate-500">
                    Personnel registered in Civora with these roles will be automatically granted submission review privileges.
                  </p>
                </div>

                {/* Key Stakeholders & Escalation Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Key Oversight Stakeholders
                    </label>
                    <input
                      type="text"
                      value={stakeholdersInput}
                      onChange={(e) => setStakeholdersInput(e.target.value)}
                      placeholder="e.g. State Infrastructure Committee, Community Liaison"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800">
                      Emergency Escalation Contact
                    </label>
                    <input
                      type="text"
                      value={escalationContact}
                      onChange={(e) => setEscalationContact(e.target.value)}
                      placeholder="e.g. ops-desk@civora.ng / +234 803 112 0099"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous: Location & Scope
                </Button>
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => setCurrentStep(4)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Reporting & Governance
                </Button>
              </div>
            </div>
          )}

          {/* SECTION 4: REPORTING & GOVERNANCE */}
          {currentStep === 4 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#4FAAA7] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Section D
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Reporting Cadence & Quality Governance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Establish statutory reporting frequency, ingestion channels, and engineering quality gates.
                </p>
              </div>

              <div className="space-y-5 text-xs">
                {/* Reporting Cadence */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800">
                    Mandatory Reporting Cadence <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'daily', label: 'Daily', desc: 'Active Site Progress' },
                      { id: 'weekly', label: 'Weekly', desc: 'Milestone Summary' },
                      { id: 'bi-weekly', label: 'Bi-Weekly', desc: 'Executive Pulse' },
                      { id: 'monthly', label: 'Monthly', desc: 'Statutory Audit' },
                    ].map((cad) => (
                      <button
                        key={cad.id}
                        type="button"
                        onClick={() => setReportingCadence(cad.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          reportingCadence === cad.id
                            ? 'bg-[#001237] text-white border-[#001237] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-xs">{cad.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            reportingCadence === cad.id ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {cad.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submission Ingestion Channels */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Authorized Ingestion Channels</span>
                    <span className="text-[11px] font-normal text-slate-400">At least one channel required</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'whatsapp',
                        name: 'WhatsApp Business Bot',
                        desc: 'Field crew daily progress & photos',
                      },
                      {
                        id: 'telegram',
                        name: 'Telegram Bot',
                        desc: 'Technical site updates & alerts',
                      },
                      {
                        id: 'portal',
                        name: 'Civora Web Portal',
                        desc: 'Official engineer CAD & formal submittals',
                      },
                    ].map((ch) => {
                      const checked = submissionChannels.includes(ch.id);
                      return (
                        <div
                          key={ch.id}
                          onClick={() => toggleChannel(ch.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                            checked
                              ? 'bg-emerald-50/60 border-emerald-300 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-[#4FAAA7] focus:ring-[#4FAAA7]"
                          />
                          <div>
                            <div className="font-bold text-xs">{ch.name}</div>
                            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                              {ch.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Required Reporting Categories */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-800">
                    Mandatory Reporting Categories
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Progress & Chainage',
                      'Workforce & Equipment',
                      'Materials & Deliveries',
                      'Quality & QA Evidence',
                      'Health & Safety (HSE)',
                      'Environmental & Community',
                    ].map((cat) => {
                      const isSelected = reportingCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#001237] text-white border-[#001237]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{cat}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#4FAAA7]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quality Safeguard Toggles */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#4FAAA7]" />
                    Quality & Audit Safeguards
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireGeotaggedPhotos}
                        onChange={(e) => setRequireGeotaggedPhotos(e.target.checked)}
                        className="mt-0.5 rounded text-[#4FAAA7] focus:ring-[#4FAAA7]"
                      />
                      <div>
                        <div className="font-bold text-slate-800">Require Geotagged Visual Evidence</div>
                        <div className="text-[11px] text-slate-500">
                          Field photos must contain valid EXIF GPS coordinates matching site corridor.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireLabBreakCert}
                        onChange={(e) => setRequireLabBreakCert(e.target.checked)}
                        className="mt-0.5 rounded text-[#4FAAA7] focus:ring-[#4FAAA7]"
                      />
                      <div>
                        <div className="font-bold text-slate-800">Mandate Lab Concrete Cube Certificates</div>
                        <div className="text-[11px] text-slate-500">
                          Structural pour items require accredited 28-day break tests before final approval.
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <div className="font-bold text-slate-800">Mandate External Stakeholder Review</div>
                        <div className="text-[11px] text-slate-500">
                          Reports require signed concurrence from client oversight representative before publication.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={stakeholderReviewRequired}
                        onChange={(e) => setStakeholderReviewRequired(e.target.checked)}
                        className="rounded text-[#4FAAA7] focus:ring-[#4FAAA7] w-4 h-4"
                      />
                    </label>
                  </div>
                </div>

                {/* Governance Notes */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    Project-Specific Governance Notes / Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={governanceNotes}
                    onChange={(e) => setGovernanceNotes(e.target.value)}
                    placeholder="Enter project-specific engineering rules, compliance constraints, or reporting instructions..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(3)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous: Team
                </Button>
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => setCurrentStep(5)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Review & Summary
                </Button>
              </div>
            </div>
          )}

          {/* SECTION 5: REVIEW & SUMMARY */}
          {currentStep === 5 && (
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-[#4FAAA7] text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Section E
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1 font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Review & Authorization Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect the consolidated metadata before provision confirmation. Click any section header to edit details.
                </p>
              </div>

              {/* Grouped Cards */}
              <div className="space-y-4 text-xs">
                {/* 1. Basics Summary */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#4FAAA7]" />
                      A. Project Basics
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-[#3B68DE] hover:underline"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Project Code</div>
                      <div className="font-mono font-bold text-slate-900">{code || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Project Type</div>
                      <div className="font-semibold text-slate-900">{projectType}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Priority</div>
                      <div className="font-bold uppercase text-slate-900">{priority}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Contract Ref</div>
                      <div className="font-mono text-slate-700">{contractRef || 'None'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Project Name</div>
                    <div className="font-semibold text-slate-900">{name || 'Unnamed Project'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Client / Sponsoring Org</div>
                    <div className="text-slate-800">{client || 'Not specified'}</div>
                  </div>
                </div>

                {/* 2. Location & Scope Summary */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#4FAAA7]" />
                      B. Location & Delivery Scope
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-[#3B68DE] hover:underline"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Location</div>
                      <div className="font-semibold text-slate-900">{city ? `${city}, ${state}` : state}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Budget</div>
                      <div className="font-bold text-slate-900">
                        {budgetAmount ? `${currency}${budgetAmount}M` : 'Pending'}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Start Date</div>
                      <div className="font-mono text-slate-800">{startDate || 'TBD'}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Target Finish</div>
                      <div className="font-mono text-slate-800">{completionDate || 'TBD'}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Site Address</div>
                    <div className="text-slate-800">{siteAddress || 'No physical address provided'}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px] uppercase">Key Deliverables ({deliverables.length})</div>
                    <div className="text-slate-700 text-xs">
                      {deliverables.length > 0 ? deliverables.join(' • ') : 'None listed'}
                    </div>
                  </div>
                </div>

                {/* 3. Team Summary */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#4FAAA7]" />
                      C. Team & Responsibilities
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-semibold text-[#3B68DE] hover:underline"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Lead Project Engineer</div>
                      <div className="font-bold text-slate-900">{leadEngineer}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Primary Contractor</div>
                      <div className="font-semibold text-slate-900">{contractor}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Client Representative</div>
                      <div className="text-slate-800">{clientRep || 'Unassigned'}</div>
                    </div>
                  </div>
                </div>

                {/* 4. Governance Summary */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#4FAAA7]" />
                      D. Reporting Cadence & Safeguards
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-semibold text-[#3B68DE] hover:underline"
                    >
                      Edit Section
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Reporting Frequency</div>
                      <div className="font-bold uppercase text-slate-900">{reportingCadence}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Submission Channels</div>
                      <div className="font-semibold text-slate-900">
                        {submissionChannels.map((c) => c.toUpperCase()).join(', ')}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Stakeholder Review</div>
                      <div className="font-semibold text-slate-900">
                        {stakeholderReviewRequired ? 'Mandatory Sign-off' : 'Advisory Only'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(4)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous: Governance
                </Button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => handleSubmit('planning')}
                    isLoading={isSubmitting}
                    className="flex-1 sm:flex-initial"
                  >
                    Save as Draft (Planning)
                  </Button>
                  <Button
                    type="button"
                    variant="teal"
                    size="md"
                    onClick={() => handleSubmit('active')}
                    isLoading={isSubmitting}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    className="flex-1 sm:flex-initial"
                  >
                    Create Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Live Summary Panel (Right Column on Desktop) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#4FAAA7]" />
                Project Scope Preview
              </span>
              <Badge variant="teal" size="sm">
                Step {currentStep} of 5
              </Badge>
            </div>

            {/* Scope Identifier Pill */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#4FAAA7]">
                  {code || 'CODE-PENDING'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {priority}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-2">
                {name || 'New Infrastructure Project Name'}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                {client || 'Client Authority Pending'}
              </div>
            </div>

            {/* Compact Key Attributes */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Sector
                </span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[150px]">
                  {projectType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Site Region
                </span>
                <span className="font-semibold text-slate-800 text-right">
                  {state ? `${state}, ${country}` : 'Not set'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Authorized Budget
                </span>
                <span className="font-bold text-slate-900 font-mono">
                  {budgetAmount ? `${currency}${budgetAmount}M` : 'Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Cadence
                </span>
                <span className="font-semibold uppercase text-slate-800 text-xs">
                  {reportingCadence}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> Lead Engineer
                </span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">
                  {leadEngineer.split(' ')[0] || user.name}
                </span>
              </div>
            </div>

            {/* Readiness Checklist */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Setup Readiness
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">A. Basics & Identifier</span>
                  {stepValidation[1] ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium text-[11px]">Incomplete</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">B. Location & Timeline</span>
                  {stepValidation[2] ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium text-[11px]">Incomplete</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">C. Project Team</span>
                  {stepValidation[3] ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium text-[11px]">Incomplete</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">D. Governance Standards</span>
                  {stepValidation[4] ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium text-[11px]">Incomplete</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-[11px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#3B68DE]" /> Governance Notice
              </div>
              <p>
                Civora provisions automated webhook bindings for WhatsApp and Telegram upon project creation. Field crew submissions will automatically link to this scope.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
