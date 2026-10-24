'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Lock,
  Building2,
  Shield,
  TrendingUp,
  FileCheck2,
  Landmark,
  Scale,
  Award,
  AlertTriangle,
  HelpCircle,
  X,
  Briefcase,
  DollarSign,
  Bell,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CivoraUser } from '@/types';

interface StakeholderOnboardingProps {
  initialUser: CivoraUser;
}

interface StepMeta {
  title: string;
  sub: string;
}

const STAKEHOLDER_STEPS: StepMeta[] = [
  { title: 'Institutional Authority', sub: 'Sponsoring ministry or investment board' },
  { title: 'Portfolio Scope', sub: 'Capital programs & monitored infrastructure' },
  { title: 'Fiduciary Safeguards', sub: 'Disbursement tiers & variation policies' },
  { title: 'Executive Cadence', sub: 'Digest schedules & critical anomaly alerts' },
  { title: 'Clearance & Activation', sub: 'Fiduciary review & dashboard activation' },
];

const INSTITUTION_TYPES = [
  {
    id: 'ministry',
    title: 'Public Works Client / Ministry / State Agency',
    desc: 'Federal Ministry of Works, State Infrastructure Bureau, FCDA, LAMATA, NPA',
    icon: Landmark,
    badge: 'Public Sector',
  },
  {
    id: 'dfi_bank',
    title: 'Development Finance Institution / Commercial Bank',
    desc: 'African Development Bank (AfDB), Bank of Industry, Stanbic IBTC Infrastructure Fund',
    icon: Building2,
    badge: 'Fiduciary Bank',
  },
  {
    id: 'concessionaire_ppp',
    title: 'Concessionaire / PPP Special Purpose Vehicle',
    desc: 'ICRC Concession Partners, Toll Road Operators, Deep Sea Terminal Concessions',
    icon: Briefcase,
    badge: 'PPP Syndicate',
  },
  {
    id: 'fund_investor',
    title: 'Institutional Pension Fund / Infrastructure Equity',
    desc: 'Nigeria Sovereign Investment Authority (NSIA), InfraCredit, Private Equity Trustees',
    icon: TrendingUp,
    badge: 'Institutional Sponsor',
  },
  {
    id: 'audit_body',
    title: 'Statutory Fiscal Responsibility & Audit Body',
    desc: 'Auditor-General of the Federation, Fiscal Responsibility Commission, Ministerial Audit',
    icon: Scale,
    badge: 'Statutory Oversight',
  },
];

const ASSET_CLASSES = [
  'Federal Highways & Bridges',
  'Urban Rail & Mass Transit',
  'Maritime Ports & Deep Sea Terminals',
  'Healthcare & Civic Public Works',
  'High-Rise Commercial Mixed-Use',
  'Regional Energy & Data Corridors',
];

const CAPITAL_RANGES = [
  {
    id: 'tier1',
    label: '₦10 Billion – ₦50 Billion',
    sub: 'Sub-regional and municipal priority infrastructure builds',
  },
  {
    id: 'tier2',
    label: '₦50 Billion – ₦250 Billion',
    sub: 'Major state corridors, rail expansion & multi-agency facilities',
  },
  {
    id: 'tier3',
    label: '₦250 Billion – ₦1 Trillion+',
    sub: 'National megaprojects, sovereign concessions & inter-state transport',
  },
];

const AVAILABLE_PROJECTS = [
  {
    id: 'prj_metro_01',
    code: 'PRJ-METRO-01',
    name: 'Lagos Metro Line Expansion (Phase 2)',
    client: 'Lagos State Ministry of Transport / LAMATA',
    budget: '₦84.5B',
    progress: 68,
  },
  {
    id: 'prj_civic_02',
    code: 'PRJ-CIVIC-02',
    name: 'Abuja Civic Center Modernization',
    client: 'Federal Capital Development Authority (FCDA)',
    budget: '₦42.1B',
    progress: 82,
  },
  {
    id: 'prj_datacenter_04',
    code: 'PRJ-DATA-04',
    name: 'Tier-3 Regional Data Center',
    client: 'Federal Ministry of Communications & Digital Economy',
    budget: '₦38.3B',
    progress: 45,
  },
  {
    id: 'prj_pier_03',
    code: 'PRJ-PIER-03',
    name: 'Lekki Coastal Pier & Logistics Slipway',
    client: 'Nigerian Ports Authority (NPA)',
    budget: '₦62.0B',
    progress: 91,
  },
];

const IPC_THRESHOLDS = [
  {
    id: 'lvl1',
    title: 'Standard Tier (Under ₦100 Million)',
    desc: 'Certified Resident Site Engineer and Lead Quantity Surveyor sign-off suffices.',
  },
  {
    id: 'lvl2',
    title: 'Dual-Signoff Tier (₦100M – ₦500M)',
    desc: 'Requires Resident Site Engineer clearance plus Sponsoring Stakeholder Executive sign-off.',
    recommended: true,
  },
  {
    id: 'lvl3',
    title: 'High-Value Tier (Above ₦500M)',
    desc: 'Mandatory full Ministerial / Board Independent Audit before capital disbursement release.',
  },
];

const VARIATION_POLICIES = [
  {
    id: 'strict',
    title: 'Strict Safeguard (2.5% Threshold)',
    desc: 'Any cumulative variation exceeding 2.5% of contract sum triggers an automatic executive audit hold.',
  },
  {
    id: 'standard',
    title: 'Standard Governance (5.0% Threshold)',
    desc: 'Variations between 5% and 10% require joint Stakeholder Executive and Consultant approval.',
  },
  {
    id: 'statutory',
    title: 'FMWH Statutory Benchmark (10.0% Threshold)',
    desc: 'Variations up to 10% permitted under statutory public procurement contingency allowances.',
  },
];

const REPORTING_CADENCES = [
  {
    id: 'weekly',
    title: 'Weekly Executive Brief',
    desc: '2-page executive summary covering milestone completions, active risks, and physical percentage gain.',
  },
  {
    id: 'biweekly',
    title: 'Bi-Weekly Capital Dossier',
    desc: 'Comprehensive financial variance breakdown, third-party lab proof hashes, and drone photo logs.',
  },
  {
    id: 'monthly',
    title: 'Monthly Statutory Council Package',
    desc: 'Complete governance dossier formatted for Executive Board or Federal Executive Council review.',
  },
];

export function StakeholderOnboarding({ initialUser }: StakeholderOnboardingProps) {
  const router = useRouter();

  // Active step: 1 through 5
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // STEP 1 State: Institutional Identity
  const [firstName, setFirstName] = useState(initialUser.firstName || '');
  const [lastName, setLastName] = useState(initialUser.lastName || '');
  const [displayName, setDisplayName] = useState(
    initialUser.displayName || `${initialUser.firstName} ${initialUser.lastName}`.trim()
  );
  const [jobTitle, setJobTitle] = useState(initialUser.title || initialUser.jobTitle || 'Oversight Director');
  const [organization, setOrganization] = useState(initialUser.organization || 'Federal Ministry of Works');
  const [institutionType, setInstitutionType] = useState('ministry');
  const [fiduciaryPhone, setFiduciaryPhone] = useState(initialUser.phone || '+234 803 000 1234');
  const [primaryJurisdiction, setPrimaryJurisdiction] = useState('Federal Republic of Nigeria');

  // STEP 2 State: Portfolio Scope
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>([
    'Federal Highways & Bridges',
    'Urban Rail & Mass Transit',
    'Maritime Ports & Deep Sea Terminals',
  ]);
  const [capitalRange, setCapitalRange] = useState('tier2');
  const [assignedProjects, setAssignedProjects] = useState<string[]>(
    initialUser.assignedProjects && initialUser.assignedProjects.length > 0
      ? initialUser.assignedProjects
      : ['prj_metro_01', 'prj_civic_02', 'prj_datacenter_04']
  );
  const [operatingZone, setOperatingZone] = useState('South West & North Central');

  // STEP 3 State: Fiduciary Safeguards
  const [ipcThreshold, setIpcThreshold] = useState('lvl2');
  const [variationPolicy, setVariationPolicy] = useState('strict');
  const [auditFrequency, setAuditFrequency] = useState('Monthly Technical Governance Review');

  // STEP 4 State: Executive Cadence & Alerts
  const [reportingCadence, setReportingCadence] = useState('weekly');
  const [alertCriticalPath, setAlertCriticalPath] = useState(true);
  const [alertQualityVariance, setAlertQualityVariance] = useState(true);
  const [alertBudgetFluctuation, setAlertBudgetFluctuation] = useState(true);
  const [alertPermitExpiry, setAlertPermitExpiry] = useState(true);
  const [deliveryChannel, setDeliveryChannel] = useState('Civora Executive Portal & Encrypted Email');

  // Multi-select toggle helpers
  const toggleAssetClass = (item: string) => {
    setSelectedAssetClasses((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const toggleProject = (projectId: string) => {
    setAssignedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((x) => x !== projectId) : [...prev, projectId]
    );
  };

  // Next / Continue button logic
  const handleNextStep = async () => {
    setErrorMessage(null);

    // Validation for Step 1
    if (currentStep === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMessage('Please provide your first and last name.');
        return;
      }
      if (!organization.trim()) {
        setErrorMessage('Please specify your sponsoring institution or organization.');
        return;
      }
    }

    // Validation for Step 2
    if (currentStep === 2) {
      if (assignedProjects.length === 0) {
        setErrorMessage('Please select at least one capital project to monitor.');
        return;
      }
    }

    setIsSaving(true);

    try {
      // Step 5 completes the onboarding
      if (currentStep === 5) {
        const res = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'complete',
            data: {
              firstName,
              lastName,
              displayName,
              jobTitle,
              title: jobTitle,
              organization,
              institutionType,
              fiduciaryPhone,
              primaryJurisdiction,
              selectedAssetClasses,
              capitalRange,
              assignedProjects,
              operatingZone,
              ipcThreshold,
              variationPolicy,
              auditFrequency,
              reportingCadence,
              alerts: {
                criticalPath: alertCriticalPath,
                qualityVariance: alertQualityVariance,
                budgetFluctuation: alertBudgetFluctuation,
                permitExpiry: alertPermitExpiry,
              },
              deliveryChannel,
            },
          }),
        });

        const resData = await res.json();
        if (!res.ok || !resData.success) {
          setErrorMessage(resData.error || 'Failed to complete onboarding. Please try again.');
          setIsSaving(false);
          return;
        }

        router.push(resData.redirectUrl || '/dashboard/stakeholder');
        router.refresh();
        return;
      }

      // Steps 1 to 4: progress save
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          data: {
            firstName,
            lastName,
            displayName,
            jobTitle,
            title: jobTitle,
            organization,
            institutionType,
            fiduciaryPhone,
            primaryJurisdiction,
            assignedProjects,
            onboardingStep: currentStep + 1,
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        setErrorMessage(resData.error || 'Failed to save progress.');
        setIsSaving(false);
        return;
      }

      setCurrentStep((prev) => prev + 1);
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrorMessage('Network connection interrupted. Please try again.');
      setIsSaving(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrorMessage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Inter',sans-serif]">
      {/* Help Modal */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Stakeholder Governance Guide"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 font-['Inter',sans-serif]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3B68DE]" />
                <h3 className="text-base font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Executive Stakeholder Governance Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close Help"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                <strong>What is the Stakeholder Oversight Role?</strong> The Civora Stakeholder Portal is purpose-built for public clients, institutional bank syndicates, and executive directors to monitor infrastructure execution without field clutter.
              </p>
              <p>
                <strong>Immutable Audit Trails:</strong> All material laboratory test sheets, concrete pour cards, and progress metrics are cryptographically verified by registered COREN Project Engineers before appearing on your dashboard.
              </p>
              <p>
                <strong>Fiduciary Controls:</strong> Setting your Interim Payment Certificate (IPC) threshold ensures high-value milestone payouts cannot be certified without executive stakeholder visibility.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <section aria-label="Stakeholder Onboarding Flow" className="flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Persistent Dark Sidebar */}
        <aside
          aria-label="Executive Setup Steps"
          className="w-full lg:w-96 bg-[#001237] text-white p-6 sm:p-8 flex flex-col justify-between shrink-0 border-r border-slate-800"
        >
          <div className="space-y-6">
            {/* Brand Logo & Subtitle */}
            <div className="space-y-1.5 border-b border-slate-800/80 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4FAAA7] flex items-center justify-center text-[#001237] font-black text-lg">
                  C
                </div>
                <div>
                  <span className="text-lg font-black tracking-tight font-['Encode_Sans_Condensed',sans-serif] uppercase text-white block">
                    CIVORA
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#4FAAA7] uppercase block">
                    STAKEHOLDER PORTAL
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 pt-1">
                Executive Fiduciary & Transparency Control Plane
              </p>
            </div>

            {/* Stepper Navigation */}
            <nav aria-label="Onboarding Steps" className="space-y-2">
              {STAKEHOLDER_STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <div
                    key={step.title}
                    className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-[#18243D] border border-[#4FAAA7]/40 shadow-xs'
                        : isCompleted
                        ? 'opacity-85'
                        : 'opacity-40'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-[#4FAAA7] text-[#001237]'
                          : 'border border-slate-600 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-snug font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide ${
                          isCurrent ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Bottom Security Guarantee Card */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="p-3.5 rounded-xl bg-[#18243D]/80 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold text-[11px] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-[#4FAAA7]" />
                <span>Executive Fiduciary Mandate</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Complies with the Nigerian Data Protection Act (NDPA 2023) and FMWH capital project disclosure standards.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-xs text-[#4FAAA7] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need guidance on governance tiers?</span>
            </button>
          </div>
        </aside>

        {/* Right Column: Interactive Form & Context Panel */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 max-w-4xl flex flex-col justify-between">
          <div className="space-y-6">
            {/* Step Counter Badge & Help Trigger */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#001237] text-[#4FAAA7] text-[11px] font-mono font-bold">
                  STEP {currentStep} OF 5
                </span>
                <span className="text-xs text-slate-400">
                  {currentStep === 1 && 'Institutional Governance'}
                  {currentStep === 2 && 'Portfolio Scope'}
                  {currentStep === 3 && 'Fiduciary Safeguards'}
                  {currentStep === 4 && 'Executive Cadence'}
                  {currentStep === 5 && 'Final Activation'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#3B68DE]" />
                <span>Help</span>
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-fadeIn"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step Titles */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                {currentStep === 1 && 'Institutional Authority & Executive Profile'}
                {currentStep === 2 && 'Portfolio Scope & Monitored Capital Projects'}
                {currentStep === 3 && 'Fiduciary Safeguards & Governance Thresholds'}
                {currentStep === 4 && 'Executive Briefing Cadence & Anomaly Alerts'}
                {currentStep === 5 && 'Fiduciary Clearance & Oversight Activation'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {currentStep === 1 &&
                  'Establish your institutional governance authority and executive identity within Nigerian capital infrastructure.'}
                {currentStep === 2 &&
                  'Select the asset classes and active capital infrastructure programs subject to your oversight.'}
                {currentStep === 3 &&
                  'Configure disbursement approval thresholds, variation order ceilings, and independent audit schedules.'}
                {currentStep === 4 &&
                  'Set your executive briefing frequency and configure automated risk triggers for site deviations.'}
                {currentStep === 5 &&
                  'Review your verified institutional mandate and activate your executive stakeholder dashboard.'}
              </p>
            </div>

            {/* STEP 1: Institutional Authority & Identity */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Elena"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Rostova"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Executive Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Elena Rostova (Director of Capital Works)"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Official Executive Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Executive Director (Capital Works)"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Sponsoring Institution / Ministry / Entity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Federal Ministry of Works & Housing, Lagos State Bureau of Infrastructure"
                    className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Institutional Authority Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {INSTITUTION_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = institutionType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setInstitutionType(type.id)}
                          className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#001237] bg-white ring-2 ring-[#001237]/10 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                              isSelected ? 'bg-[#001237] text-[#4FAAA7]' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{type.title}</h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {type.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{type.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Portfolio Scope & Monitored Projects */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Infrastructure Asset Classes Under Mandate (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ASSET_CLASSES.map((item) => {
                      const isSelected = selectedAssetClasses.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAssetClass(item)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#001237] text-white border-[#001237] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span>{item}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Total Monitored Capital Range
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {CAPITAL_RANGES.map((rng) => {
                      const isSelected = capitalRange === rng.id;
                      return (
                        <button
                          key={rng.id}
                          type="button"
                          onClick={() => setCapitalRange(rng.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#001237] bg-white ring-2 ring-[#001237]/10 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-bold text-xs text-slate-900 font-mono block">
                            {rng.label}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            {rng.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Active Capital Projects Monitored ({assignedProjects.length} Selected)
                    </label>
                    <span className="text-[11px] text-slate-400">Read-Only Live Feeds</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AVAILABLE_PROJECTS.map((proj) => {
                      const isSelected = assignedProjects.includes(proj.id);
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => toggleProject(proj.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                            isSelected
                              ? 'border-[#3B68DE] bg-blue-50/20 ring-1 ring-[#3B68DE]'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-[11px] font-bold text-[#001237]">
                                {proj.code}
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                {proj.name}
                              </h4>
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {proj.budget}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {proj.client}
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                            <span className="text-slate-400">Milestone: {proj.progress}%</span>
                            <span
                              className={`font-semibold ${
                                isSelected ? 'text-[#3B68DE]' : 'text-slate-400'
                              }`}
                            >
                              {isSelected ? 'Monitored' : 'Click to Add'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Fiduciary Safeguards & Governance Thresholds */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Interim Payment Certificate (IPC) Stakeholder Sign-Off Threshold
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {IPC_THRESHOLDS.map((tier) => {
                      const isSelected = ipcThreshold === tier.id;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setIpcThreshold(tier.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-[#001237] bg-white ring-2 ring-[#001237]/10 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'border-[#001237] bg-[#001237]'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-900">{tier.title}</h4>
                              {tier.recommended && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  RECOMMENDED
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{tier.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Variation Order (VO) Oversight Policy
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {VARIATION_POLICIES.map((pol) => {
                      const isSelected = variationPolicy === pol.id;
                      return (
                        <button
                          key={pol.id}
                          type="button"
                          onClick={() => setVariationPolicy(pol.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                            isSelected
                              ? 'border-[#001237] bg-white ring-2 ring-[#001237]/10 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'border-[#001237] bg-[#001237]'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{pol.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{pol.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Independent Quality & Geotechnical Audit Frequency
                  </label>
                  <select
                    value={auditFrequency}
                    onChange={(e) => setAuditFrequency(e.target.value)}
                    className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                  >
                    <option value="Bi-Weekly Milestone Audits">Bi-Weekly Milestone Audits</option>
                    <option value="Monthly Technical Governance Review">Monthly Technical Governance Review</option>
                    <option value="Quarterly Executive Statutory Inspection">Quarterly Executive Statutory Inspection</option>
                    <option value="Milestone-Based Tranche Release Verification">Milestone-Based Tranche Release Verification</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 4: Executive Cadence & Anomaly Alerts */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Executive Briefing & Report Delivery Cadence
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {REPORTING_CADENCES.map((cad) => {
                      const isSelected = reportingCadence === cad.id;
                      return (
                        <button
                          key={cad.id}
                          type="button"
                          onClick={() => setReportingCadence(cad.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#001237] bg-white ring-2 ring-[#001237]/10 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <h4 className="text-xs font-bold text-slate-900">{cad.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-1">{cad.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Automated Executive Anomaly Triggers (Direct Escalations)
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={alertCriticalPath}
                        onChange={(e) => setAlertCriticalPath(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#001237] accent-[#001237]"
                      />
                      <div className="text-xs">
                        <strong className="text-slate-900 block font-semibold">Critical Path Schedule Slippage</strong>
                        <span className="text-slate-500 text-[11px]">
                          Escalate immediately if any milestone delays exceed 7 days against the approved baseline program.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={alertQualityVariance}
                        onChange={(e) => setAlertQualityVariance(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#001237] accent-[#001237]"
                      />
                      <div className="text-xs">
                        <strong className="text-slate-900 block font-semibold">Structural Material Quality Variance</strong>
                        <span className="text-slate-500 text-[11px]">
                          Alert if concrete cube crushing or steel rebar yield fails independent UNILAG/FMWH laboratory verification.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={alertBudgetFluctuation}
                        onChange={(e) => setAlertBudgetFluctuation(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#001237] accent-[#001237]"
                      />
                      <div className="text-xs">
                        <strong className="text-slate-900 block font-semibold">Contract Sum & Price Fluctuation Claims</strong>
                        <span className="text-slate-500 text-[11px]">
                          Immediate notice if EPC contractor files material price escalation claims (cement, diesel, bitumen, FX).
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={alertPermitExpiry}
                        onChange={(e) => setAlertPermitExpiry(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-[#001237] accent-[#001237]"
                      />
                      <div className="text-xs">
                        <strong className="text-slate-900 block font-semibold">Statutory Environmental & Planning Notice</strong>
                        <span className="text-slate-500 text-[11px]">
                          30-day early notification before LASBCA stage clearance or Federal EIA permits reach expiry.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Final Clearance & Activation */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif] text-[#001237]">
                        Executive Fiduciary Mandate Summary
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      FIDUCIARY ACCREDITED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Executive Identity</span>
                      <strong className="text-slate-900 font-semibold">{displayName}</strong>
                      <span className="block text-[11px] text-[#4FAAA7] font-medium">{jobTitle}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Sponsoring Institution</span>
                      <strong className="text-slate-900 font-semibold">{organization}</strong>
                      <span className="block text-[11px] text-slate-500">
                        {institutionType.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Monitored Portfolio</span>
                      <strong className="text-slate-900 font-semibold font-mono">
                        {assignedProjects.length} Priority Capital Builds
                      </strong>
                      <span className="block text-[11px] text-slate-500">
                        {selectedAssetClasses.slice(0, 2).join(', ')}…
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px]">Fiduciary Threshold</span>
                      <strong className="text-slate-900 font-semibold">
                        {ipcThreshold === 'lvl2' ? 'Level 2: Dual Sign-off (₦100M+)' : 'Strict IPC Threshold'}
                      </strong>
                      <span className="block text-[11px] text-slate-500">
                        {variationPolicy === 'strict' ? '2.5% Variation Audit' : 'Standard 5% Policy'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs text-emerald-900 space-y-1">
                  <strong className="font-bold flex items-center gap-1.5 text-[#008751]">
                    <Award className="w-4 h-4" /> Stakeholder Oversight Clearance Granted
                  </strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Your Civora account has been provisioned with executive read-only transparency and real-time capital milestone verification across active Nigerian builds.
                  </p>
                </div>
              </div>
            )}

            {/* Important Notes */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                Institutional Governance Notes
              </h4>
              <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4 leading-relaxed">
                {currentStep === 1 && (
                  <>
                    <li>Your institutional identity is displayed on certified milestone audit dossiers.</li>
                    <li>Read-only access protects fiduciary oversight from operational field tampering.</li>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <li>You can expand or filter your monitored projects at any time from your executive portfolio.</li>
                    <li>Physical progress is updated automatically as field engineers verify structural pour cards.</li>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <li>Disbursement holds prevent contractor payment release without independent COREN QA confirmation.</li>
                    <li>Variation orders exceeding your policy threshold generate immediate ministerial review alerts.</li>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <li>Anomaly alerts are dispatched securely according to your selected escalation triggers.</li>
                    <li>All data transfers are protected under Nigerian Data Protection Act (NDPA 2023) protocols.</li>
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    <li>Review your entries carefully before activating your executive dashboard.</li>
                    <li>You will be directed straight to your Executive Portfolio Oversight control plane.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-8 border-t border-slate-200 mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSaving || currentStep === 1}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSaving}
                className="px-8 py-3 rounded-full bg-[#001237] hover:bg-[#18243D] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider flex items-center gap-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {currentStep === 5 ? 'Enter Stakeholder Dashboard' : 'Continue'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-mono">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Bank-Grade 256-bit encryption &bull; NDPA 2023 Compliant Fiduciary Transparency
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
