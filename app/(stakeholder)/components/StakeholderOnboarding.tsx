'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Shield,
  Eye,
  FileCheck2,
  Bell,
  Clock,
  Briefcase,
  User,
  Building,
  Mail,
  Phone,
  Globe,
  Lock,
  ChevronLeft,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { DEMO_PROJECTS } from '@/lib/mock-data/fixtures';

interface StakeholderOnboardingProps {
  user: CivoraUser;
  initialStep?: number;
}

const SEED_ORG_NAMES = new Set([
  'Civora Infrastructure Ltd',
  'Apex Coastal Civil Engineering Ltd',
  'Apex Infrastructure Nigeria Ltd',
  'Civora Core Infrastructure',
]);

export function StakeholderOnboarding({ user, initialStep = 1 }: StakeholderOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Profile fields state (Step 2) - clean manual entry without seed defaults
  const [fullName, setFullName] = useState(user.name || '');
  const [organization, setOrganization] = useState(
    user.organization && !SEED_ORG_NAMES.has(user.organization) ? user.organization : ''
  );
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [timezone, setTimezone] = useState(user.timeZone || '');
  const [profileErrors, setProfileErrors] = useState<{ fullName?: string }>({});

  // Notification Preferences state (Step 4) - unchecked by default for manual selection
  const [notifyReleasedReports, setNotifyReleasedReports] = useState(false);
  const [notifyMilestones, setNotifyMilestones] = useState(false);
  const [notifyAnnouncements, setNotifyAnnouncements] = useState(false);
  const [channelEmail, setChannelEmail] = useState(false);
  const [channelInApp, setChannelInApp] = useState(false);

  // Saving / Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveProjects, setLiveProjects] = useState<Project[]>([]);

  // Fetch live projects from backend via `/api/projects`
  React.useEffect(() => {
    let active = true;
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (!active || !Array.isArray(data?.projects)) return;
        setLiveProjects(data.projects);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Assigned projects resolution (Section 3.2) supporting both live backend UUIDs/codes and DEMO_PROJECTS
  const assignedProjects = React.useMemo(() => {
    if (liveProjects.length > 0) {
      return liveProjects;
    }
    const codes = (user as CivoraUser & { assignedProjectCodes?: string[] }).assignedProjectCodes || [];
    if (!user.assignedProjects || user.assignedProjects.length === 0) {
      return [];
    }
    if (user.assignedProjects.includes('*')) {
      return DEMO_PROJECTS;
    }
    const matched = DEMO_PROJECTS.filter(
      (p) =>
        user.assignedProjects?.includes(p.id) ||
        user.assignedProjects?.includes(p.code) ||
        codes.includes(p.code)
    );
    return matched.length > 0 ? matched : DEMO_PROJECTS.slice(0, 2);
  }, [liveProjects, user]);

  // Step 2 Validation
  const validateProfile = (): boolean => {
    const errors: { fullName?: string } = {};
    if (!fullName.trim()) {
      errors.fullName = 'Enter your full name to continue.';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileContinue = async () => {
    if (!validateProfile()) return;
    const trimmed = fullName.trim();
    const parts = trimmed.split(' ');
    const firstName = parts[0] || trimmed;
    const lastName = parts.slice(1).join(' ') || 'Stakeholder';

    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 2,
          data: {
            firstName,
            lastName,
            fullName: trimmed,
            displayName: trimmed,
            organization,
            jobTitle,
            phone,
            timeZone: timezone,
          },
        }),
      });
    } catch {
      // Proceed even if network call has transient error
    }
    setCurrentStep(3);
  };

  const handleSavePreferences = async (useDefaults = false) => {
    const prefs = useDefaults
      ? {
          notifyReleasedReports: true,
          notifyMilestones: true,
          notifyAnnouncements: true,
          channelEmail: true,
          channelInApp: true,
        }
      : {
          notifyReleasedReports,
          notifyMilestones,
          notifyAnnouncements,
          channelEmail,
          channelInApp,
        };

    if (useDefaults) {
      setNotifyReleasedReports(true);
      setNotifyMilestones(true);
      setNotifyAnnouncements(true);
    }

    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 4,
          data: { notificationPreferences: prefs },
        }),
      });
    } catch {
      // Proceed to step 5
    }
    setCurrentStep(5);
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const trimmed = fullName.trim() || user.name || 'Stakeholder Representative';
      const parts = trimmed.split(' ');
      const firstName = parts[0] || trimmed;
      const lastName = parts.slice(1).join(' ') || 'Stakeholder';

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 10,
          action: 'complete',
          data: {
            firstName,
            lastName,
            fullName: trimmed,
            displayName: trimmed,
            organization,
            jobTitle,
            phone,
            timeZone: timezone,
            notificationPreferences: {
              notifyReleasedReports,
              notifyMilestones,
              notifyAnnouncements,
              channelEmail,
              channelInApp,
            },
          },
        }),
      });

      const resData = await res.json().catch(() => ({}));

      if (assignedProjects.length > 0) {
        router.push(resData.redirectUrl || '/stakeholder');
      } else {
        router.push('/access-pending');
      }
      router.refresh();
    } catch {
      setIsSubmitting(false);
    }
  };

  const stepsMeta = [
    { number: 1, label: 'Welcome' },
    { number: 2, label: 'Profile' },
    { number: 3, label: 'Access' },
    { number: 4, label: 'Preferences' },
    { number: 5, label: 'Finish' },
  ];

  return (
    <div className="min-h-screen bg-[#001237] text-slate-100 flex flex-col justify-between font-['Inter',sans-serif] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3B68DE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#4FAAA7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="h-20 px-6 sm:px-12 flex items-center justify-between border-b border-slate-800/80 relative z-10">
        <CivoraLogo size="sm" showTagline={false} href="/" theme="dark" />

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            {user.email}
          </span>
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-white transition-colors border border-slate-700 rounded-lg px-3 py-1.5"
          >
            Sign out
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Stepper Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Line connector */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-[#4FAAA7] -translate-y-1/2 -z-0 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (stepsMeta.length - 1)) * 100}%` }}
              />

              {stepsMeta.map((s) => {
                const isCompleted = currentStep > s.number;
                const isCurrent = currentStep === s.number;
                return (
                  <div key={s.number} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) setCurrentStep(s.number);
                      }}
                      disabled={!isCompleted && !isCurrent}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-[#4FAAA7] text-[#001237] cursor-pointer'
                          : isCurrent
                          ? 'bg-[#001237] border-2 border-[#4FAAA7] text-[#4FAAA7] shadow-[0_0_12px_rgba(79,170,167,0.4)]'
                          : 'bg-[#18243D] border border-slate-700 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.number}
                    </button>
                    <span
                      className={`text-[10px] font-medium mt-1 hidden sm:block ${
                        isCurrent ? 'text-[#4FAAA7] font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Welcome (Exact copy from Spec Section 5) */}
          {currentStep === 1 && (
            <div className="rounded-2xl bg-[#18243D]/95 border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <span className="text-[11px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider text-[#4FAAA7]">
                  CIVORA STAKEHOLDER ACCESS
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
                  Your project updates, clearly in view.
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                  Welcome to Civora. Your stakeholder workspace brings together approved project information, released reports, milestone updates, and key activity for the projects you have been invited to follow.
                </p>
              </div>

              {/* Supporting note from Section 5 */}
              <div className="p-4 rounded-xl bg-[#001237]/70 border border-slate-700/60 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                <Shield className="w-5 h-5 text-[#4FAAA7] shrink-0 mt-0.5" />
                <p>
                  <strong>Supporting note:</strong> Your access is limited to the projects and information authorized for you. Internal reviews, draft reports, and restricted evidence remain private unless explicitly shared with you.
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Set up my account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-300 text-xs font-semibold text-center transition-colors"
                >
                  Sign out
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Complete your profile (Exact copy & fields from Spec Section 5) */}
          {currentStep === 2 && (
            <div className="rounded-2xl bg-[#18243D]/95 border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
                  Let’s set up your profile
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Confirm the details people will use to identify you in Civora.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Full name (Required) */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Full name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (profileErrors.fullName) setProfileErrors({});
                      }}
                      placeholder="e.g. Elena Rostova"
                      className={`w-full bg-[#001237] border rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#4FAAA7] transition-colors ${
                        profileErrors.fullName ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {profileErrors.fullName && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{profileErrors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* Work email (Read-only when verified) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Work email</label>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      readOnly
                      value={user.email}
                      className="w-full bg-[#001237]/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-300 font-mono cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Email is verified and cannot be changed here.
                  </span>
                </div>

                {/* Organization & Job title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Organization <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Organization name"
                        className="w-full bg-[#001237] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#4FAAA7] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Job title <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Project Owner, Funder"
                        className="w-full bg-[#001237] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#4FAAA7] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Timezone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Phone number <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 20 ..."
                        className="w-full bg-[#001237] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#4FAAA7] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Time zone <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="e.g. Europe/London"
                        className="w-full bg-[#001237] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#4FAAA7] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleProfileContinue}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Save and continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto text-xs text-slate-400 hover:text-slate-200 py-2.5 px-3"
                >
                  Do this later
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Access summary (Exact copy from Spec Section 5) */}
          {currentStep === 3 && (
            <div className="rounded-2xl bg-[#18243D]/95 border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
                  Here’s what you can access
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Your access is based on the projects assigned to your account. You can view released reports and approved project updates. You cannot change project records or approve reports from this workspace.
                </p>
              </div>

              {/* Assigned Projects or Access Pending */}
              {assignedProjects.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                    <span>Assigned Capital Projects ({assignedProjects.length})</span>
                    <span>Access Status</span>
                  </div>

                  <div className="space-y-2">
                    {assignedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3.5 rounded-xl bg-[#001237]/80 border border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{proj.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                              {proj.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {proj.location} &bull; Client: {proj.client}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Active Membership
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Information Categories Scope */}
                  <div className="p-3.5 rounded-xl bg-[#001237]/50 border border-slate-700/60 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      Permitted Information Categories
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />
                        <span>Project Overview & Status</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />
                        <span>Visible Milestones & Dates</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#4FAAA7]" />
                        <span>Approved Released Reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Access Pending state from Spec Section 5 */
                <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Access pending</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your account setup is complete, but project access has not been activated yet. You’ll be able to view project updates once an authorized project administrator confirms your access.
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Notification preferences (Exact copy from Spec Section 5) */}
          {currentStep === 4 && (
            <div className="rounded-2xl bg-[#18243D]/95 border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
                  Choose the updates you want to receive
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Civora can notify you when new project information is released to your stakeholder workspace.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {/* Released report notifications */}
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#001237] border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors">
                  <div>
                    <span className="font-bold text-white block">Released report notifications</span>
                    <span className="text-[11px] text-slate-400">
                      Alerts when monthly, structural, or QA/QC reports are officially signed off.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyReleasedReports}
                    onChange={(e) => setNotifyReleasedReports(e.target.checked)}
                    className="w-4 h-4 accent-[#4FAAA7] rounded cursor-pointer"
                  />
                </label>

                {/* Milestone/status change notifications */}
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#001237] border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors">
                  <div>
                    <span className="font-bold text-white block">Milestone & status change notifications</span>
                    <span className="text-[11px] text-slate-400">
                      Key milestone completions and target date progress shifts.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyMilestones}
                    onChange={(e) => setNotifyMilestones(e.target.checked)}
                    className="w-4 h-4 accent-[#4FAAA7] rounded cursor-pointer"
                  />
                </label>

                {/* Important project announcements */}
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#001237] border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors">
                  <div>
                    <span className="font-bold text-white block">Important project announcements</span>
                    <span className="text-[11px] text-slate-400">
                      High-level stakeholder updates from project leadership.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyAnnouncements}
                    onChange={(e) => setNotifyAnnouncements(e.target.checked)}
                    className="w-4 h-4 accent-[#4FAAA7] rounded cursor-pointer"
                  />
                </label>

                {/* Delivery Channels */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#001237]/60 border border-slate-700/60 cursor-pointer">
                    <span className="text-slate-300 font-medium">Email notifications</span>
                    <input
                      type="checkbox"
                      checked={channelEmail}
                      onChange={(e) => setChannelEmail(e.target.checked)}
                      className="w-4 h-4 accent-[#4FAAA7] rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#001237]/60 border border-slate-700/60 cursor-pointer">
                    <span className="text-slate-300 font-medium">In-app notifications</span>
                    <input
                      type="checkbox"
                      checked={channelInApp}
                      onChange={(e) => setChannelInApp(e.target.checked)}
                      className="w-4 h-4 accent-[#4FAAA7] rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePreferences(false)}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>Save preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePreferences(true)}
                  className="w-full sm:w-auto text-xs text-slate-400 hover:text-slate-200 py-2.5 px-3"
                >
                  Use default preferences
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review and finish (Exact copy from Spec Section 5) */}
          {currentStep === 5 && (
            <div className="rounded-2xl bg-[#18243D]/95 border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
                  You’re ready to use Civora
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your stakeholder workspace is ready. Open your dashboard to review project status, milestones, and released reports available to your account.
                </p>
              </div>

              {/* Ready summary badge */}
              <div className="max-w-sm mx-auto p-3.5 rounded-xl bg-[#001237]/80 border border-slate-700/80 text-xs text-slate-300 text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account:</span>
                  <span className="font-semibold text-white">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authorized Scope:</span>
                  <span className="text-[#4FAAA7] font-semibold">{assignedProjects.length} Active Projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Permissions:</span>
                  <span className="text-slate-300 font-mono text-[11px]">Read-Only Stakeholder</span>
                </div>
              </div>

              {/* CTA from Spec */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-sm font-bold transition-all shadow-xl cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Opening Workspace...' : 'Open my dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="h-14 px-6 sm:px-12 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 relative z-10 font-mono">
        <span>Civora Stakeholder Portal &bull; ISO 19650 Governance</span>
        <span>Version 2.4.0</span>
      </footer>
    </div>
  );
}
