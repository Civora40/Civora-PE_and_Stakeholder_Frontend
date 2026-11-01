'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Lock,
  Play,
  HelpCircle,
  X,
  FileCheck2,
  HardHat,
  Building2,
  ShieldAlert,
  Scale,
  Award,
  FlaskConical,
} from 'lucide-react';
import { CivoraUser } from '@/types';

interface OnboardingFlowProps {
  initialUser: CivoraUser;
}

interface StepMeta {
  title: string;
  sub: string;
}

const STEPS: StepMeta[] = [
  { title: 'Identity & COREN', sub: 'Personal details & engineering identity' },
  { title: 'Corporate & CAC', sub: 'Company profile & CAC details' },
  { title: 'Operational Role', sub: 'Field & administrative responsibilities' },
  { title: 'Operating Zones', sub: 'States & geopolitical coverage' },
  { title: 'Technical Codes', sub: 'COREN, BS, ASTM & Nigerian Codes' },
  { title: 'Material Testing', sub: 'Cube crushing, rebar & soil tests' },
  { title: 'Site RFIs & SIs', sub: 'Site instructions & RFI escalation' },
  { title: 'Progress Cadence', sub: 'Progress reports & valuation cycles' },
  { title: 'Statutory Permits', sub: 'LASBCA, EIA & statutory permits' },
  { title: 'Clearance Review', sub: 'Security review & dashboard clearance' },
];

const NIGERIAN_STATES = [
  'Lagos State (South West)',
  'Abuja FCT (North Central)',
  'Rivers State - Port Harcourt (South South)',
  'Ogun State (South West)',
  'Oyo State - Ibadan (South West)',
  'Kano State (North West)',
  'Delta State - Warri/Asaba (South South)',
  'Akwa Ibom State - Uyo (South South)',
  'Anambra State - Onitsha/Awka (South East)',
  'Enugu State (South East)',
  'Edo State - Benin City (South South)',
  'Kaduna State (North West)',
  'Plateau State - Jos (North Central)',
  'Ondo State - Akure (South West)',
  'Cross River State - Calabar (South South)',
  'Other Nigerian State',
];

const COREN_CATEGORIES = [
  { id: 'registered_engineer', label: 'Registered Engineer (COREN Reg.)', badge: 'COREN Engr' },
  { id: 'corporate_member_nse', label: 'Corporate Member NSE (MNSE / FNSE)', badge: 'NSE Member' },
  { id: 'registered_technologist', label: 'Registered Engineering Technologist', badge: 'Technologist' },
  { id: 'corbon_builder', label: 'Registered Builder (CORBON License)', badge: 'CORBON' },
  { id: 'niqs_surveyor', label: 'Registered Quantity Surveyor (QSRBN/NIQS)', badge: 'NIQS' },
  { id: 'graduate_trainee', label: 'Graduate Engineer / Candidate in Training', badge: 'Graduate' },
];

const CONTRACTOR_TIERS = [
  'Tier 1 Major National EPC (e.g. Julius Berger, Craneburg, ITB)',
  'Tier 2 Commercial Engineering & Building Contractor',
  'Specialist Subcontractor (Deep Piling, Structural Steel, MEP)',
  'Consulting Structural & Civil Engineering Firm',
  'Public Works Client / Government Ministry / Parastatal',
];

const ROLE_OPTIONS = [
  {
    id: 'Resident Site Engineer',
    title: 'Resident Site Engineer (RSE)',
    desc: 'Daily site diary, slump tests, cube batching, rebar verification & setting-out sign-off',
    icon: <HardHat className="w-5 h-5 text-[#4FAAA7]" />,
    badge: 'Field Reviewer',
  },
  {
    id: 'Project Manager (Civil/Structural)',
    title: 'Project Manager (Civil/Structural)',
    desc: 'Milestone tracking, contractor program oversight, subcontractor coordination & IPC approval',
    icon: <Building2 className="w-5 h-5 text-[#3B68DE]" />,
    badge: 'Site Manager',
  },
  {
    id: 'Quantity Surveyor (NIQS)',
    title: 'Quantity Surveyor (NIQS)',
    desc: 'Bill of Quantities (BOQ), material take-offs, valuation sheets & price fluctuation claims',
    icon: <Scale className="w-5 h-5 text-[#4FAAA7]" />,
    badge: 'Commercial',
  },
  {
    id: 'QA/QC Materials Engineer',
    title: 'QA/QC Materials Engineer',
    desc: 'Soil compaction (CBR/Proctor), steel tensile certs (ASCON/Kamsteel) & Dangote 42.5R batch audits',
    icon: <FlaskConical className="w-5 h-5 text-indigo-600" />,
    badge: 'Lab Inspector',
  },
  {
    id: 'Consultant Supervising Engineer',
    title: 'Supervising Consultant Engineer',
    desc: 'Client-side technical oversight, design clarifications, structural audit & formal Site Instructions (SIs)',
    icon: <FileCheck2 className="w-5 h-5 text-emerald-600" />,
    badge: 'Consultant',
  },
  {
    id: 'Government Regulatory Inspector',
    title: 'Statutory Agency Inspector',
    desc: 'LASBCA, FCDA Development Control, FMWH or FERMA stage inspection & compliance verification',
    icon: <Award className="w-5 h-5 text-rose-600" />,
    badge: 'Regulator',
  },
];

const GEOPOLITICAL_ZONES = [
  {
    id: 'South West',
    label: 'South West (Lagos, Ogun, Oyo)',
    desc: 'Coastal silt, lagoon mangrove swamp, deep piling, laterite borrow pits',
  },
  {
    id: 'North Central',
    label: 'North Central (Abuja FCT, Niger, Plateau)',
    desc: 'Basement complex, rock cuts, granite quarries, expansive clays',
  },
  {
    id: 'South South',
    label: 'South South (Rivers, Delta, Akwa Ibom)',
    desc: 'Niger Delta mangrove, high water table, marine piling & shoreline revetments',
  },
  {
    id: 'South East',
    label: 'South East (Anambra, Enugu, Imo)',
    desc: 'Gully erosion corridors, sandstone formation, red lateritic soils',
  },
  {
    id: 'North West',
    label: 'North West (Kano, Kaduna, Sokoto)',
    desc: 'Sudan savannah, semiarid laterites, heavy earthwork, dust suppression',
  },
  {
    id: 'North East',
    label: 'North East (Bauchi, Borno, Gombe)',
    desc: 'Sahelian sandy clay, seasonal flood drainage channels, bridge culverts',
  },
];

const ACCREDITED_LABS = [
  'University of Lagos (UNILAG) Civil Materials Lab — Akoka, Lagos',
  'Federal Ministry of Works Central Materials Testing Lab — Keffi, Nasarawa',
  'Ahmadu Bello University (ABU) Civil Engineering Lab — Zaria, Kaduna',
  'Rivers State University Civil Testing Center — Port Harcourt',
  'Certified Contractor On-Site Quality Control Testing Laboratory',
];

const STATUTORY_AGENCIES = [
  'Lagos State Building Control Agency (LASBCA) — Lagos',
  'Federal Capital Development Authority (FCDA) Dept. of Development Control — Abuja',
  'Rivers State Ministry of Physical Planning & Urban Development — Port Harcourt',
  'Federal Ministry of Works & Housing (FMWH Highways Directorate)',
  'Ogun State Ministry of Urban & Physical Planning — Abeokuta',
];

const SEED_ORG_NAMES = new Set([
  'Civora Infrastructure Ltd',
  'Apex Coastal Civil Engineering Ltd',
  'Apex Infrastructure Nigeria Ltd',
  'Civora Core Infrastructure',
]);

const SEED_CAC_NUMBERS = new Set([
  'RC-45190',
  'RC-1928374',
  'RC-8841023',
  'RC 1849204',
  'RC-11234',
]);

function sanitizeOrgForUser(rawOrg: unknown, email?: string): string {
  const str = typeof rawOrg === 'string' ? rawOrg.trim() : '';
  if (!str) return '';
  const lowerEmail = (email || '').toLowerCase();
  const isSeedAccount =
    lowerEmail.endsWith('@civora.internal') ||
    lowerEmail.endsWith('@civora.io') ||
    lowerEmail.endsWith('@apexcivil.com') ||
    lowerEmail.endsWith('@juliusberger.com');
  if (!isSeedAccount && SEED_ORG_NAMES.has(str)) {
    return '';
  }
  return str;
}

function sanitizeCacForUser(rawCac: unknown, email?: string): string {
  const str = typeof rawCac === 'string' ? rawCac.trim() : '';
  if (!str) return '';
  const lowerEmail = (email || '').toLowerCase();
  const isSeedAccount =
    lowerEmail.endsWith('@civora.internal') ||
    lowerEmail.endsWith('@civora.io') ||
    lowerEmail.endsWith('@apexcivil.com') ||
    lowerEmail.endsWith('@juliusberger.com');
  if (!isSeedAccount && SEED_CAC_NUMBERS.has(str)) {
    return '';
  }
  return str;
}

import { StakeholderOnboarding } from '@/app/(stakeholder)/components/StakeholderOnboarding';

export function OnboardingFlow({ initialUser }: OnboardingFlowProps) {
  if (initialUser.role === 'read_only_stakeholder') {
    return <StakeholderOnboarding user={initialUser} />;
  }

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(
    initialUser.onboardingStep && initialUser.onboardingStep >= 1 && initialUser.onboardingStep <= 10
      ? initialUser.onboardingStep
      : 1
  );

  const [user, setUser] = useState<CivoraUser>(initialUser);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Questionnaire Form States across the 10 steps (clean manual entry; no auto-filled seed values)
  // Step 1: Personal & COREN
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [displayName, setDisplayName] = useState(
    user.displayName && user.displayName !== user.name ? user.displayName : ''
  );
  const [corenCategory, setCorenCategory] = useState(
    (user as CivoraUser & { corenCategory?: string }).corenCategory || ''
  );
  const [corenNumber, setCorenNumber] = useState(user.corenNumber || '');
  const [phone, setPhone] = useState(user.phone || '');

  // Hydrate onboarding progress from backend on mount
  React.useEffect(() => {
    let active = true;
    fetch('/api/onboarding')
      .then((res) => res.json())
      .then((resData) => {
        if (!active || !resData?.success || !resData.user) return;
        const u = resData.user as CivoraUser & Record<string, unknown>;
        setUser(u);
        if (typeof resData.currentStep === 'number' && resData.currentStep >= 1 && resData.currentStep <= 10) {
          setCurrentStep(resData.currentStep);
        }
        if (u.firstName) setFirstName(String(u.firstName));
        if (u.lastName) setLastName(String(u.lastName));
        if (u.displayName && u.displayName !== u.name) setDisplayName(String(u.displayName));
        if (u.corenCategory) setCorenCategory(String(u.corenCategory));
        if (u.corenNumber) setCorenNumber(String(u.corenNumber));
        if (u.phone) setPhone(String(u.phone));
        setOrganization(
          sanitizeOrgForUser(u.registeredOrganization || u.organization, u.email)
        );
        setCacNumber(sanitizeCacForUser(u.cacNumber, u.email));
        if (u.officeState) setOfficeState(String(u.officeState));
        if (u.contractorTier) setContractorTier(String(u.contractorTier));
        if (u.primaryResponsibility) setOperationalRole(String(u.primaryResponsibility));
        if (u.geopoliticalZone) setOperatingZone(String(u.geopoliticalZone));
        if (u.projectCategory) setProjectCategory(String(u.projectCategory));
        if (Array.isArray(u.standardsBaseline) && u.standardsBaseline.length > 0) {
          setSelectedCodes(u.standardsBaseline as string[]);
        }
        if (u.rebarYield) setRebarYield(String(u.rebarYield));
        if (u.concreteClass) setConcreteClass(String(u.concreteClass));
        if (u.testingLab) setTestingLab(String(u.testingLab));
        if (Array.isArray(u.testingProtocols) && u.testingProtocols.length > 0) {
          setTestingProtocols(u.testingProtocols as string[]);
        }
        if (typeof u.reviewSlaDays === 'number') setReviewSlaDays(u.reviewSlaDays);
        if (u.siApprovalPathway) setSiApprovalPathway(String(u.siApprovalPathway));
        if (u.rfiEscalationTier) setVoThreshold(String(u.rfiEscalationTier));
        if (typeof u.mandatoryGps === 'boolean') setMandatoryGps(u.mandatoryGps);
        if (u.reportingCadence) setReportingCadence(String(u.reportingCadence));
        if (u.primaryAudience) setPrimaryAudience(String(u.primaryAudience));
        if (u.statutoryAgency) setStatutoryAgency(String(u.statutoryAgency));
        if (u.lasbcaPermitNumber) setLasbcaPermitNumber(String(u.lasbcaPermitNumber));
        if (Array.isArray(u.statutoryPermits) && u.statutoryPermits.length > 0) {
          setStatutoryPermits(u.statutoryPermits as string[]);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Step 2: Corporate & CAC
  const [organization, setOrganization] = useState(
    sanitizeOrgForUser(
      (user as CivoraUser & { registeredOrganization?: string }).registeredOrganization || user.organization,
      user.email
    )
  );
  const [cacNumber, setCacNumber] = useState(sanitizeCacForUser(user.cacNumber, user.email));
  const [officeState, setOfficeState] = useState(user.officeState || '');
  const [contractorTier, setContractorTier] = useState('');

  // Step 3: Operational Role
  const [operationalRole, setOperationalRole] = useState(user.primaryResponsibility || '');

  // Step 4: Operating Zones & Terrain
  const [operatingZone, setOperatingZone] = useState(user.geopoliticalZone || '');
  const [projectCategory, setProjectCategory] = useState(user.projectCategory || '');

  // Step 5: Engineering Codes
  const [selectedCodes, setSelectedCodes] = useState<string[]>(user.standardsBaseline || []);
  const [rebarYield, setRebarYield] = useState('');
  const [concreteClass, setConcreteClass] = useState('');

  // Step 6: Material Testing
  const [testingLab, setTestingLab] = useState(user.testingLab || '');
  const [testingProtocols, setTestingProtocols] = useState<string[]>([]);
  const [reviewSlaDays, setReviewSlaDays] = useState(user.reviewSlaDays || 3);

  // Step 7: Site RFIs & SIs
  const [siApprovalPathway, setSiApprovalPathway] = useState('');
  const [voThreshold, setVoThreshold] = useState('');
  const [mandatoryGps, setMandatoryGps] = useState(false);

  // Step 8: Progress Cadence & IPC
  const [reportingCadence, setReportingCadence] = useState(user.reportingCadence || '');
  const [primaryAudience, setPrimaryAudience] = useState('');

  // Step 9: Statutory Permits
  const [statutoryAgency, setStatutoryAgency] = useState('');
  const [lasbcaPermitNumber, setLasbcaPermitNumber] = useState(user.lasbcaPermitNumber || '');
  const [statutoryPermits, setStatutoryPermits] = useState<string[]>([]);

  // Helper toggle
  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  // Step Submissions
  const handleNextStep = async () => {
    setErrorMessage(null);

    // Basic Validation per step
    if (currentStep === 1) {
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMessage('Enter your first name and last name.');
        return;
      }
      if (!corenNumber.trim()) {
        setErrorMessage('Please enter your COREN or Engineering Membership Registration Number.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!organization.trim()) {
        setErrorMessage('Enter your registered organization name.');
        return;
      }
      if (!cacNumber.trim()) {
        setErrorMessage('Please enter your Corporate Affairs Commission (CAC) RC Number.');
        return;
      }
    }

    setIsSaving(true);

    try {
      const stepDataMap: Record<number, Record<string, unknown>> = {
        1: {
          firstName,
          lastName,
          displayName,
          corenStatus: corenCategory,
          corenCategory,
          corenNumber,
          phone,
        },
        2: { organization, cacNumber, officeState, contractorTier },
        3: { primaryResponsibility: operationalRole },
        4: { geopoliticalZone: operatingZone, projectCategory },
        5: { standardsBaseline: selectedCodes, rebarYield, concreteClass },
        6: { testingLab, testingProtocols, reviewSlaDays },
        7: { rfiEscalationTier: voThreshold, siApprovalPathway, mandatoryGps },
        8: { reportingCadence, primaryAudience },
        9: { statutoryAgency, lasbcaPermitNumber, statutoryPermits },
      };

      const payloadData = stepDataMap[currentStep] || {};

      if (currentStep === 10) {
        // Complete Onboarding
        const res = await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: 10,
            action: 'complete',
            data: {
              firstName,
              lastName,
              displayName,
              phone,
              corenNumber,
              corenStatus: corenCategory,
              corenCategory,
              organization,
              cacNumber,
              officeState,
              contractorTier,
              primaryResponsibility: operationalRole,
              geopoliticalZone: operatingZone,
              projectCategory,
              standardsBaseline: selectedCodes,
              rebarYield,
              concreteClass,
              testingLab,
              testingProtocols,
              reviewSlaDays,
              rfiEscalationTier: voThreshold,
              siApprovalPathway,
              mandatoryGps,
              reportingCadence,
              primaryAudience,
              statutoryAgency,
              lasbcaPermitNumber,
              statutoryPermits,
            },
          }),
        });

        const resData = await res.json();
        if (!res.ok || !resData.success) {
          setErrorMessage(resData.error || 'Failed to complete onboarding. Please try again.');
          setIsSaving(false);
          return;
        }

        router.push(
          resData.redirectUrl ||
            (user.role === 'read_only_stakeholder'
              ? '/stakeholder'
              : '/dashboard')
        );
        router.refresh();
        return;
      }

      // Steps 1 to 9
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          data: payloadData,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        setErrorMessage(resData.error || 'Failed to save progress. Please try again.');
        setIsSaving(false);
        return;
      }

      setUser(resData.user);
      setCurrentStep(resData.nextStep || currentStep + 1);
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrorMessage('Network connection interrupted. Please try again.');
      setIsSaving(false);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#001237] flex flex-col lg:flex-row font-['Inter',sans-serif] selection:bg-[#4FAAA7]/30 selection:text-[#001237]">
      {/* LEFT SIDEBAR: Deep Forest Navy Panel - Fixed & Non-Scrollable on Desktop */}
      <aside className="w-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-[380px] xl:w-[420px] 2xl:w-[440px] lg:h-screen lg:overflow-y-auto bg-[#091D26] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-20 border-r border-[#18243D]/50 selection:bg-[#4FAAA7]/40">
        <div>
            {/* Top Brand Logo Squircle */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Image src="/images/browser_icon.png" width={22} height={22} alt="Civora Nigeria" />
                </div>
                <div>
                  <span className="font-['Encode_Sans_Condensed',sans-serif] font-black text-xl tracking-wider uppercase block leading-none">
                    CIVORA
                  </span>
                  <span className="text-[10px] text-[#4FAAA7] font-semibold tracking-widest uppercase block mt-1">
                    NIGERIA CONTROL PLANE
                  </span>
                </div>
              </div>

              {/* Nigerian Flag Emblem */}
              <div className="flex items-center gap-0.5 w-6 h-4 rounded overflow-hidden shadow-xs border border-white/20">
                <span className="w-2 h-full bg-[#008751]" />
                <span className="w-2 h-full bg-white" />
                <span className="w-2 h-full bg-[#008751]" />
              </div>
            </div>

            {/* Vertical Multi-Step Connected Timeline (10 Steps) */}
            <nav aria-label="Onboarding Progress" className="relative pl-1">
              {/* Continuous vertical tracking line */}
              <div className="absolute left-[13px] top-3 bottom-6 w-0.5 bg-white/15" />

              <ol className="space-y-4 sm:space-y-5">
                {STEPS.map((s, idx) => {
                  const stepNum = idx + 1;
                  const isCompleted = stepNum < currentStep;
                  const isActive = stepNum === currentStep;

                  return (
                    <li key={s.title} className="relative flex items-start gap-3.5 group">
                      {/* Step Indicator Dot */}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(stepNum)}
                        className="relative z-10 flex-shrink-0 mt-0.5 cursor-pointer focus:outline-none"
                        aria-label={`Jump to step ${stepNum}: ${s.title}`}
                      >
                        {isCompleted ? (
                          <div className="w-6 h-6 rounded-full bg-[#4FAAA7] text-[#091D26] flex items-center justify-center font-bold shadow-sm">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-[#091D26] flex items-center justify-center shadow-lg shadow-white/20">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-white/30 bg-[#091D26] flex items-center justify-center text-[10px] text-white/40 group-hover:border-white/60">
                            {stepNum}
                          </div>
                        )}
                      </button>

                      {/* Step Label & Sub-description */}
                      <button
                        type="button"
                        onClick={() => setCurrentStep(stepNum)}
                        className="text-left transition-all cursor-pointer group-hover:translate-x-0.5"
                      >
                        <span
                          className={`block text-xs font-semibold leading-tight font-['Encode_Sans_Condensed',sans-serif] tracking-wide ${
                            isActive
                              ? 'text-white font-bold'
                              : isCompleted
                              ? 'text-slate-200'
                              : 'text-slate-400/80'
                          }`}
                        >
                          {s.title}
                        </span>
                        <span
                          className={`block text-[11px] leading-snug mt-0.5 ${
                            isActive
                              ? 'text-slate-300'
                              : 'text-slate-400/60'
                          }`}
                        >
                          {s.sub}
                        </span>

                        {/* Subtle sub-dots indicator on active step matching reference image */}
                        {isActive && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4FAAA7]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          {/* Bottom Sidebar Action Links */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-medium">
            <button
              type="button"
              onClick={handlePrevStep}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>&larr; Go back</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="hover:text-[#4FAAA7] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need help?</span>
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT PANEL: Clean White Workspace - Scrollable Document Flow */}
        <section className="w-full lg:pl-[380px] xl:pl-[420px] 2xl:pl-[440px] min-h-screen bg-white flex flex-col justify-between z-10">
          <div className="p-6 sm:p-10 lg:p-12 xl:p-16 min-h-screen flex-1 flex flex-col justify-between">
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">
              <div>
            {/* Header: Title & Subtitle */}
            <div className="space-y-1.5 mb-6">
              <span className="text-[11px] font-bold text-[#4FAAA7] uppercase tracking-widest font-['Encode_Sans_Condensed',sans-serif]">
                QUESTIONNAIRE &bull; STEP {currentStep} OF 10
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight uppercase leading-tight">
                {currentStep === 1 && 'Professional Profile & COREN Registration'}
                {currentStep === 2 && 'Corporate Organization & CAC Details'}
                {currentStep === 3 && 'Operational Role & Reporting Focus'}
                {currentStep === 4 && 'Project Operating Zones & Terrain'}
                {currentStep === 5 && 'Technical Standards & Baseline Codes'}
                {currentStep === 6 && 'Material Quality & Cube Crushing Protocols'}
                {currentStep === 7 && 'Site Clarifications & Site Instructions (SI)'}
                {currentStep === 8 && 'Progress Reporting & Interim Valuations (IPC)'}
                {currentStep === 9 && 'Statutory Approvals & Environmental Permits'}
                {currentStep === 10 &&
                  (user.role === 'read_only_stakeholder'
                    ? 'Final Clearance & Stakeholder Dashboard Activation'
                    : 'Final Clearance & Control Plane Activation')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                {currentStep === 1 &&
                  'The next few questions configure your engineering profile and confirm COREN practice accreditation for Nigerian civil works.'}
                {currentStep === 2 &&
                  'Verify your contracting enterprise credentials, CAC registration, and tax governance jurisdiction in Nigeria.'}
                {currentStep === 3 &&
                  'Select your operational responsibility within the site hierarchy to calibrate inspection and submittal approvals.'}
                {currentStep === 4 &&
                  'Define the geopolitical zones and environmental soil conditions where your active builds are located.'}
                {currentStep === 5 &&
                  'Select the baseline technical standards, rebar yield thresholds, and concrete strength classes for automated checks.'}
                {currentStep === 6 &&
                  'Establish third-party accredited laboratory testing cycles for concrete cubes, high-yield rebar, and soil compaction.'}
                {currentStep === 7 &&
                  'Set the legal and financial thresholds for site instructions, geotechnical variances, and consultant RFIs.'}
                {currentStep === 8 &&
                  'Configure progress update schedules, milestone valuation dossiers, and Bank Project Monitoring sign-offs.'}
                {currentStep === 9 &&
                  'Record statutory development planning clearances, LASBCA/FCDA stage notices, and Federal EIA permits.'}
                {currentStep === 10 &&
                  (user.role === 'read_only_stakeholder'
                    ? 'Review your executive stakeholder profile and activate your read-only oversight dashboard.'
                    : 'Review your verified Nigerian construction profile and activate your Civora engineering control plane.')}
              </p>
            </div>

            {/* Highlight / Program Overview Box matching reference UI */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#001237] block font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  COREN & FMWH Technical Governance Framework
                </span>
                <p className="text-[11px] text-slate-500">
                  Automated discrepancy tracking and immutable evidence validation for Nigerian infrastructure.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-700 flex-shrink-0">
                <span className="flex items-center gap-1 text-[#008751]">
                  &bull; 7 & 28-day cube tracking
                </span>
                <span className="flex items-center gap-1 text-[#3B68DE]">
                  &bull; LASBCA/FCDA stage alerts
                </span>
              </div>
            </div>

            {/* "The Process Explained" Guide Box with Media Preview matching reference UI */}
            <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  The process explained
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review Nigerian site standards, laboratory testing criteria, and statutory verification checkpoints for this stage.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(true)}
                    className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#001237] text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-current text-[#4FAAA7]" />
                    <span>Watch guide &bull; 2 min</span>
                  </button>
                </div>
              </div>

              {/* Video Thumbnail Preview Card matching reference */}
              <div
                onClick={() => setShowGuideModal(true)}
                className="relative w-full sm:w-56 h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0 cursor-pointer group border border-slate-300/80"
              >
                <Image
                  src="/images/auth_hero.jpg"
                  alt="Civora Nigerian Construction Guide"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-[#001237]/40 group-hover:bg-[#001237]/25 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-[#001237] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5 text-[#001237]" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-white">
                  Nigerian Site Spec v2.6
                </div>
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn"
              >
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* INTERACTIVE QUESTIONNAIRE PER STEP */}
            <div className="space-y-4 mb-8">
              {/* STEP 1: Personal & COREN */}
              {currentStep === 1 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Marcus"
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Vance"
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Display Title & Full Professional Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Engr. Marcus Vance, FNSE, COREN"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        COREN / Professional Category
                      </label>
                      <select
                        value={corenCategory}
                        onChange={(e) => setCorenCategory(e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                      >
                        <option value="">Select COREN / Professional Category...</option>
                        {COREN_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.label}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Registration / License No. <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={corenNumber}
                        onChange={(e) => setCorenNumber(e.target.value)}
                        placeholder="e.g. COREN/R.58492"
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 font-mono uppercase focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nigerian Contact Telephone (SMS Alerts for Critical Site NCRs)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 123 4567"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Corporate & CAC */}
              {currentStep === 2 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Registered Contracting Firm / Corporate Enterprise
                      </label>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Bound to Account
                      </span>
                    </div>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Julius Berger Nigeria Plc / Apex Infrastructure"
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        CAC RC / Business Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cacNumber}
                        onChange={(e) => setCacNumber(e.target.value)}
                        placeholder="RC 1849204"
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 font-mono uppercase focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Primary Office State in Nigeria
                      </label>
                      <select
                        value={officeState}
                        onChange={(e) => setOfficeState(e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                      >
                        <option value="">Select Primary Office State...</option>
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Contractor Scale & Classification
                    </label>
                    <select
                      value={contractorTier}
                      onChange={(e) => setContractorTier(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Contractor Scale & Classification...</option>
                      {CONTRACTOR_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 3: Operational Role */}
              {currentStep === 3 && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROLE_OPTIONS.map((r) => {
                      const isSelected = operationalRole === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setOperationalRole(r.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'border-[#001237] bg-slate-50 ring-2 ring-[#001237]'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">{r.icon}</div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#001237]">{r.title}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                {r.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Operating Zones & Terrain */}
              {currentStep === 4 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Primary Geopolitical Terrain Zone
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {GEOPOLITICAL_ZONES.map((z) => {
                        const isSelected = operatingZone === z.id;
                        return (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => setOperatingZone(z.id)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#001237] bg-slate-50 ring-1 ring-[#001237]'
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <span className="block text-xs font-bold text-[#001237]">{z.label}</span>
                            <span className="block text-[11px] text-slate-500 mt-0.5">{z.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Primary Project Portfolio Category
                    </label>
                    <select
                      value={projectCategory}
                      onChange={(e) => setProjectCategory(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Primary Project Portfolio Category...</option>
                      <option>Federal Highways, Dual-Carriageways & Bridges (FMWH)</option>
                      <option>High-Rise Commercial & Residential Towers (Lagos / Abuja)</option>
                      <option>Coastal Defense, Marine Revetments & Ports (Lekki / Eko Atlantic)</option>
                      <option>Industrial Petrochemical, Refinery & Energy Civil Infrastructure</option>
                      <option>Urban Stormwater Channels, Culverts & Drainage Systems</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 5: Engineering Codes & Standards */}
              {currentStep === 5 && (
                <div className="space-y-3.5">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Technical Specification Codes (Checked for Automated Compliance)
                    </label>
                    <div className="space-y-2">
                      {[
                        'Nigerian National Building Code (NBC)',
                        'FMWH Highway Manual Vol. 1 & 2',
                        'BS 8110 / BS EN 1992 (Eurocode 2 - Concrete)',
                        'BS 5950 / BS EN 1993 (Eurocode 3 - Structural Steel)',
                        'ASTM A615 Grade 60 Rebar Standard',
                        'AASHTO Highway & Bridge Standard Specifications',
                      ].map((code) => {
                        const checked = selectedCodes.includes(code);
                        return (
                          <label
                            key={code}
                            className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleArrayItem(selectedCodes, code, setSelectedCodes)}
                              className="w-4 h-4 rounded border-slate-300 text-[#001237] accent-[#001237]"
                            />
                            <span>{code}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Rebar Characteristic Yield Strength (fy)
                      </label>
                      <select
                        value={rebarYield}
                        onChange={(e) => setRebarYield(e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                      >
                        <option value="">Select Rebar Yield Strength...</option>
                        <option>500 N/mm² (High-Yield Deformed Bars - BS 4449 Grade 500B)</option>
                        <option>460 N/mm² (High-Yield Ribbed Bars - BS 4449 Grade 460)</option>
                        <option>250 N/mm² (Mild Steel Round Bars)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Primary Concrete Strength Class
                      </label>
                      <select
                        value={concreteClass}
                        onChange={(e) => setConcreteClass(e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                      >
                        <option value="">Select Concrete Strength Class...</option>
                        <option>C30/37 (Structural Beams, Columns & Slabs)</option>
                        <option>C25/30 (Reinforced Pad Foundations & Retaining Walls)</option>
                        <option>C40/50 (Prestressed Marine Girders & Deep Piles)</option>
                        <option>C20/25 (Blinding & Unreinforced Mass Concrete)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Material Testing Protocols & Laboratories */}
              {currentStep === 6 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Primary Independent Accredited Testing Laboratory
                    </label>
                    <select
                      value={testingLab}
                      onChange={(e) => setTestingLab(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Accredited Testing Laboratory...</option>
                      {ACCREDITED_LABS.map((lab) => (
                        <option key={lab} value={lab}>
                          {lab}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mandatory Quality Testing Schedules
                    </label>
                    <div className="space-y-2">
                      {[
                        'Concrete Cube Crushing Tests (3 cubes @ 7 days, 3 cubes @ 28 days)',
                        'Steel Rebar Tensile Yield & Cold Bend Tests (per 20-ton batch)',
                        'Sand Sieve Analysis & Silt Content Inspection (< 4% for sharp sand)',
                        'Subgrade & Subbase Compaction (CBR / Proctor Testing)',
                        'Asphalt Core Extraction & Marshall Bitumen Stability',
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={testingProtocols.includes(item)}
                            onChange={() => toggleArrayItem(testingProtocols, item, setTestingProtocols)}
                            className="w-4 h-4 rounded border-slate-300 text-[#001237] accent-[#001237]"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>Submittal Review Target SLA</span>
                      <span className="font-bold text-[#001237]">{reviewSlaDays} Working Days</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={7}
                      value={reviewSlaDays}
                      onChange={(e) => setReviewSlaDays(Number(e.target.value))}
                      className="w-full accent-[#001237]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>48 Hours (Fast-track)</span>
                      <span>3 Days (Standard)</span>
                      <span>7 Days (Federal Public Works)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Site Clarifications & RFIs */}
              {currentStep === 7 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Site Instruction (SI) Formal Approval Pathway
                    </label>
                    <select
                      value={siApprovalPathway}
                      onChange={(e) => setSiApprovalPathway(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Site Instruction Approval Pathway...</option>
                      <option>Resident Engineer & Supervising Consultant Dual Authorization</option>
                      <option>Project Director Exclusive Sign-Off</option>
                      <option>Client Representative Counter-Signature Required</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Variation Order (VO) Financial Escalation Threshold
                    </label>
                    <select
                      value={voThreshold}
                      onChange={(e) => setVoThreshold(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Variation Order Escalation Threshold...</option>
                      <option>Under ₦2,500,000 (Field level approval by Resident Engineer)</option>
                      <option>₦2,500,000 — ₦10,000,000 (Requires Lead Consultant Sign-Off)</option>
                      <option>Above ₦10,000,000 (Client Executive & Capital Committee approval)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={mandatoryGps}
                        onChange={(e) => setMandatoryGps(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#001237] accent-[#001237]"
                      />
                      <span>
                        <strong>Enforce Mandatory GPS Geotagging & Timestamps:</strong> Every inspection photo and field measurement must include hardware GPS coordinates to prevent fraudulent site claims.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 8: Progress Cadence & IPC */}
              {currentStep === 8 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Standard Technical Reporting Cadence
                    </label>
                    <select
                      value={reportingCadence}
                      onChange={(e) => setReportingCadence(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Technical Reporting Cadence...</option>
                      <option>Weekly Site Progress Brief & Monthly IPC Valuation Dossier</option>
                      <option>Bi-Weekly Submittal Reconciliation & Monthly Milestone Review</option>
                      <option>Monthly Comprehensive Technical Governance Pack</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Primary Valuation Review Audience
                    </label>
                    <select
                      value={primaryAudience}
                      onChange={(e) => setPrimaryAudience(e.target.value)}
                      className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
                    >
                      <option value="">Select Valuation Review Audience...</option>
                      <option>Bank Project Monitoring Engineer (PME) & Client Delivery Directorate</option>
                      <option>Federal / State Ministry of Works Project Monitoring Taskforce</option>
                      <option>Internal Corporate Executive Board & Shareholder Audit</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 9: Statutory Approvals */}
              {currentStep === 9 && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Primary Statutory Planning Authority
                      </label>
                      <select
                        value={statutoryAgency}
                        onChange={(e) => setStatutoryAgency(e.target.value)}
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#001237] focus:outline-none"
                      >
                        <option value="">Select Statutory Planning Authority...</option>
                        {STATUTORY_AGENCIES.map((ag) => (
                          <option key={ag} value={ag}>
                            {ag}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Planning Approval / LASBCA File No.
                      </label>
                      <input
                        type="text"
                        value={lasbcaPermitNumber}
                        onChange={(e) => setLasbcaPermitNumber(e.target.value)}
                        placeholder="LASBCA/DEV/2026/0842"
                        className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 font-mono uppercase focus:border-[#001237] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Verified Statutory Records on File
                    </label>
                    <div className="space-y-2">
                      {[
                        'Building Development Planning Permit (Approved Architectural/Structural Sheets)',
                        'Certified Geotechnical Subsoil Boring Investigation Report',
                        'Federal Ministry of Environment EIA / Environmental Management Plan',
                        'Stage 1 Setting-Out & Excavation Statutory Notice',
                        'State Fire Service Safety Clearance Certificate',
                      ].map((doc) => (
                        <label
                          key={doc}
                          className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={statutoryPermits.includes(doc)}
                            onChange={() => toggleArrayItem(statutoryPermits, doc, setStatutoryPermits)}
                            className="w-4 h-4 rounded border-slate-300 text-[#001237] accent-[#001237]"
                          />
                          <span>{doc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 10: Final Clearance & Review */}
              {currentStep === 10 && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif] text-[#001237]">
                          Nigerian Technical Governance Profile Summary
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        COREN VERIFIED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Professional Identity</span>
                        <strong className="text-slate-900 font-semibold">
                          {displayName || `${firstName} ${lastName}`.trim() || 'Not specified'}
                        </strong>
                        <span className="block text-[11px] text-[#4FAAA7] font-mono">
                          {corenNumber || 'Pending COREN No.'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Contracting Enterprise & CAC</span>
                        <strong className="text-slate-900 font-semibold">{organization || 'Not specified'}</strong>
                        <span className="block text-[11px] text-slate-500 font-mono">
                          {cacNumber || 'Pending CAC'} &bull; {(officeState || 'Nigeria').split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Operational Focus & Zone</span>
                        <strong className="text-slate-900 font-semibold">{operationalRole || 'Not specified'}</strong>
                        <span className="block text-[11px] text-slate-500">
                          {operatingZone || 'National'} &bull; {(projectCategory || 'Infrastructure').split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Testing & Planning Registry</span>
                        <strong className="text-slate-900 font-semibold">
                          {(testingLab || 'Pending Lab Selection').split('—')[0]}
                        </strong>
                        <span className="block text-[11px] text-slate-500 font-mono">
                          {lasbcaPermitNumber || 'Pending Statutory Permit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs text-emerald-900 space-y-1">
                    <strong className="font-bold flex items-center gap-1.5 text-[#008751]">
                      <Award className="w-4 h-4" />{' '}
                      {user.role === 'read_only_stakeholder'
                        ? 'Stakeholder Oversight Clearance Granted'
                        : 'Engineering Clearance Granted'}
                    </strong>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {user.role === 'read_only_stakeholder'
                        ? 'Your Civora account has been provisioned with executive oversight and read-only transparency monitoring across active Nigerian capital projects.'
                        : 'Your Civora account has been provisioned with certified compliance templates tailored to Nigerian civil infrastructure and COREN guidelines.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Important Notes Section matching reference UI */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
                Important Notes
              </h4>
              <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4 leading-relaxed">
                {currentStep === 1 && (
                  <>
                    <li>Only registered engineering personnel (COREN) can authorize concrete pour cards and structural submittals under Nigerian law.</li>
                    <li>Your COREN registration number is automatically watermarked on generated site verification sheets.</li>
                    <li>Take your time to ensure your professional display name matches your sealed engineering stamp.</li>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <li>Corporate Affairs Commission (CAC) verification confirms corporate tax and statutory legitimacy.</li>
                    <li>Subcontractors and site inspectors are assigned within your organization&apos;s isolated tenant space.</li>
                    <li>Primary state jurisdiction determines regional building control integration (e.g. LASBCA in Lagos, FCDA in Abuja).</li>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <li>Your operational role determines the inspection checklists and digital submittal workflows routed to your dashboard.</li>
                    <li>Dual sign-off is automatically required for critical structural pours and geotechnical pile capping.</li>
                    <li>Roles do not self-assign platform admin permissions; platform configuration is restricted to administrators.</li>
                  </>
                )}
                {currentStep >= 4 && currentStep <= 9 && (
                  <>
                    <li>All site documentation complies with the Nigerian National Building Code and FMWH Highway Manuals.</li>
                    <li>Third-party lab certificates (UNILAG / FMWH Central Lab) are cryptographically hashed to prevent fraudulent cube results.</li>
                    <li>Refer to the Civora Technical Resource Guide at any time using the &quot;Need help?&quot; link.</li>
                  </>
                )}
                {currentStep === 10 && (
                  <>
                    <li>Review your entries carefully before completing onboarding.</li>
                    <li>You can update individual project assignments from your project settings dashboard.</li>
                    <li>Your session is protected by NDPA 2023 compliant data governance protocols.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Action Bar matching reference UI */}
          <div className="pt-8 border-t border-slate-200 mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider"
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
                      {currentStep === 10
                        ? user.role === 'read_only_stakeholder'
                          ? 'Enter Stakeholder Dashboard'
                          : 'Enter Civora Control Plane'
                        : 'Continue'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Bank-level 256-bit encryption guarantee note matching reference UI */}
            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-mono">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                We use Bank-level, 256-bit encryption to keep your data safe. Fully compliant with Nigerian Data Protection Act (NDPA 2023) &bull; COREN Practice Standards.
              </span>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* HELP MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Image src="/images/browser_icon.png" width={20} height={20} alt="Civora" />
                <h3 className="text-sm font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
                  Civora Nigeria Technical Support Desk
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Our engineering advisory team in Lagos and Abuja is available to assist your firm with setup, COREN accreditation verification, and LASBCA integration:
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div><strong>Lagos Office:</strong> Plot 14, Commercial Avenue, Victoria Island, Lagos</div>
                <div><strong>Abuja Desk:</strong> Shehu Shagari Way, Central Business District, Abuja FCT</div>
                <div><strong>Direct Tel:</strong> +234 (0) 1 888 2486 / +234 803 000 CIVORA</div>
                <div><strong>Technical Email:</strong> advisory@civora.ng</div>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#001237] text-white text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]"
            >
              Got it, continue onboarding
            </button>
          </div>
        </div>
      )}

      {/* VIDEO / SPECIFICATION GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide flex items-center gap-2">
                <Play className="w-4 h-4 text-[#4FAAA7] fill-current" />
                Civora Nigeria Technical Governance Overview
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center">
              <Image
                src="/images/auth_hero.jpg"
                alt="Civora Guide"
                fill
                className="object-cover opacity-60"
              />
              <div className="relative z-10 text-center space-y-2 p-4">
                <div className="w-12 h-12 rounded-full bg-[#4FAAA7] text-[#001237] mx-auto flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
                <h4 className="text-sm font-bold text-white font-['Encode_Sans_Condensed',sans-serif] uppercase">
                  Nigerian Site Quality Assurance & Cube Verification Guide
                </h4>
                <p className="text-[11px] text-slate-300 max-w-sm mx-auto">
                  Standardized submittals, rebar yield testing, and FMWH/COREN pour card approval protocols.
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <strong>Key Takeaway:</strong> All submittals processed in Civora require digital chain-of-custody verification from sampling to certified laboratory crushing.
            </div>
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#001237] text-white text-xs font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]"
            >
              Close and resume questionnaire
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
