'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  Ticket,
  ChevronDown,
  HardHat,
  ShieldCheck,
} from 'lucide-react';

const ENGINEER_TITLE_PRESETS = [
  'Project Engineer',
  'Project Manager',
  'Site Engineer',
  'Reporting Officer',
  'Quality Assurance Inspector',
  'Civil Superintendent',
  'Other',
];

const STAKEHOLDER_TITLE_PRESETS = [
  'Capital Programs Oversight Director',
  'Statutory Compliance Auditor',
  'Client / Ministry Representative',
  'Executive Board Member',
  'Financial Sponsor Representative',
  'Community Liaison Lead',
  'Other',
];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  organization?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  invitationCode?: string;
  server?: string;
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountType, setAccountType] = useState<'engineer' | 'stakeholder'>('engineer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('Project Engineer');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inviteParam = searchParams.get('invitation') || searchParams.get('code') || '';
  const [invitationCode, setInvitationCode] = useState(inviteParam);
  const [showInvitationField, setShowInvitationField] = useState(Boolean(inviteParam));
  const [agreeTerms, setAgreeTerms] = useState(false); // Unchecked by default per security spec

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const presetsList =
    accountType === 'stakeholder' ? STAKEHOLDER_TITLE_PRESETS : ENGINEER_TITLE_PRESETS;

  const effectiveJobTitle =
    selectedJobTitle === 'Other' ? customJobTitle.trim() : selectedJobTitle;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Enter your first name.';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Enter your last name.';
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Enter a valid work email address.';
    }

    if (!organization.trim()) {
      newErrors.organization = 'Enter your organization or company name.';
    }

    if (!password) {
      newErrors.password = 'Enter a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'The passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Please accept the required terms to continue.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          organization: organization.trim(),
          jobTitle: effectiveJobTitle,
          role: accountType === 'stakeholder' ? 'read_only_stakeholder' : 'project_engineer',
          accountType,
          password,
          confirmPassword,
          invitationCode: invitationCode.trim() || undefined,
          agreeTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({
          server:
            data.error ||
            'We couldn’t create your account. Check your details and try again.',
        });
        setIsLoading(false);
        return;
      }

      // Successful registration creates session and forwards to onboarding flow
      const destination = data.nextUrl || '/onboarding';
      router.push(destination);
      router.refresh();
    } catch {
      setErrors({
        server: 'Your connection was interrupted. Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-5">
      {/* Header Info */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[#4FAAA7] uppercase tracking-widest font-['Encode_Sans_Condensed',sans-serif]">
          GET STARTED WITH CIVORA
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight uppercase">
          Create your Civora account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
          Set up your account to access the construction reporting workspace you have been invited to use.
        </p>
      </div>

      {/* Global Server Error Banner */}
      {errors.server && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{errors.server}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Account Role / Workspace Selection */}
        <div className="space-y-1.5 pb-1">
          <label className="block text-xs font-semibold text-slate-700">
            Account Type & Workspace Role <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAccountType('engineer');
                setSelectedJobTitle('Project Engineer');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                accountType === 'engineer'
                  ? 'bg-[#001237] text-white border-[#001237] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <HardHat className={`w-4 h-4 ${accountType === 'engineer' ? 'text-[#4FAAA7]' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">Project Engineer</span>
              </div>
              <p className={`text-[11px] mt-1 ${accountType === 'engineer' ? 'text-slate-300' : 'text-slate-500'}`}>
                Field submittals, QA review & technical approvals
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setAccountType('stakeholder');
                setSelectedJobTitle('Capital Programs Oversight Director');
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                accountType === 'stakeholder'
                  ? 'bg-[#001237] text-white border-[#001237] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${accountType === 'stakeholder' ? 'text-[#4FAAA7]' : 'text-slate-500'}`} />
                <span className="font-bold text-xs">Stakeholder / Client</span>
              </div>
              <p className={`text-[11px] mt-1 ${accountType === 'stakeholder' ? 'text-slate-300' : 'text-slate-500'}`}>
                Capital oversight, statutory compliance & audit reports
              </p>
            </button>
          </div>
        </div>

        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="reg-firstName"
              className="block text-xs font-semibold text-slate-700"
            >
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="reg-firstName"
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
              }}
              placeholder="Sarah"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'reg-firstName-err' : undefined}
              className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                errors.firstName
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
              }`}
            />
            {errors.firstName && (
              <p id="reg-firstName-err" className="text-[11px] text-rose-600 font-medium">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reg-lastName"
              className="block text-xs font-semibold text-slate-700"
            >
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="reg-lastName"
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
              }}
              placeholder="Lin, PE"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'reg-lastName-err' : undefined}
              className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                errors.lastName
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
              }`}
            />
            {errors.lastName && (
              <p id="reg-lastName-err" className="text-[11px] text-rose-600 font-medium">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Work Email */}
        <div className="space-y-1">
          <label
            htmlFor="reg-email"
            className="block text-xs font-semibold text-slate-700"
          >
            Work Email <span className="text-rose-500">*</span>
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="engineer@firm.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'reg-email-err' : undefined}
            className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
              errors.email
                ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                : 'border-slate-300 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
            }`}
          />
          {errors.email && (
            <p id="reg-email-err" className="text-[11px] text-rose-600 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Row 3: Organization & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="reg-organization"
              className="block text-xs font-semibold text-slate-700"
            >
              Organization / Company <span className="text-rose-500">*</span>
            </label>
            <input
              id="reg-organization"
              name="organization"
              type="text"
              required
              autoComplete="organization"
              value={organization}
              onChange={(e) => {
                setOrganization(e.target.value);
                if (errors.organization)
                  setErrors((prev) => ({ ...prev, organization: undefined }));
              }}
              placeholder="Apex Engineering Ltd"
              aria-invalid={!!errors.organization}
              aria-describedby={errors.organization ? 'reg-org-err' : undefined}
              className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                errors.organization
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
              }`}
            />
            {errors.organization && (
              <p id="reg-org-err" className="text-[11px] text-rose-600 font-medium">
                {errors.organization}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="reg-jobTitle"
                className="block text-xs font-semibold text-slate-700"
              >
                Job Title <span className="text-slate-400 font-normal">(Profile)</span>
              </label>
            </div>
            <div className="relative">
              <select
                id="reg-jobTitle"
                value={selectedJobTitle}
                onChange={(e) => setSelectedJobTitle(e.target.value)}
                className="w-full appearance-none rounded-xl bg-white border border-slate-300 pl-3.5 pr-8 py-2.5 text-sm text-slate-900 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
              >
                {presetsList.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* If 'Other' job title chosen, show custom input */}
        {selectedJobTitle === 'Other' && (
          <div className="space-y-1 animate-fadeIn">
            <label
              htmlFor="reg-customJobTitle"
              className="block text-xs font-semibold text-slate-700"
            >
              Specify Your Title
            </label>
            <input
              id="reg-customJobTitle"
              type="text"
              value={customJobTitle}
              onChange={(e) => setCustomJobTitle(e.target.value)}
              placeholder="e.g. Structural Verification Lead"
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none shadow-xs"
            />
          </div>
        )}

        {/* Security Notice: Job Title is not a permission role */}
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
          <Briefcase className="w-3.5 h-3.5 text-[#4FAAA7] flex-shrink-0" />
          <span>Job titles are for profile identification. Platform access is governed by server-assigned permissions.</span>
        </p>

        {/* Row 4: Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label
              htmlFor="reg-pass"
              className="block text-xs font-semibold text-slate-700"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-pass"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'reg-pass-err' : undefined}
                className={`w-full rounded-xl bg-white border pl-3.5 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                  errors.password
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.password && (
              <p id="reg-pass-err" className="text-[11px] text-rose-600 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reg-confirm"
              className="block text-xs font-semibold text-slate-700"
            >
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'reg-confirm-err' : undefined}
                className={`w-full rounded-xl bg-white border pl-3.5 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-xs ${
                  errors.confirmPassword
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-[#001237] focus:ring-1 focus:ring-[#001237]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="reg-confirm-err" className="text-[11px] text-rose-600 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Optional Invitation Code Accordion */}
        <div className="pt-1">
          {!showInvitationField ? (
            <button
              type="button"
              onClick={() => setShowInvitationField(true)}
              className="text-xs text-[#001237] hover:text-[#4FAAA7] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-[#4FAAA7]" />
              <span>Have an invitation or workspace code?</span>
            </button>
          ) : (
            <div className="space-y-1 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="reg-invitation"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Invitation Code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowInvitationField(false);
                    setInvitationCode('');
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Dismiss
                </button>
              </div>
              <input
                id="reg-invitation"
                name="invitationCode"
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                placeholder="e.g. INV-CIVORA-ENG-2026"
                className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-xs font-mono uppercase text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                Authorized invitations automatically bind your account to pre-approved projects.
              </p>
            </div>
          )}
        </div>

        {/* Row 6: Explicit Terms Acceptance (unchecked by default) */}
        <div className="pt-1 space-y-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              id="reg-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#001237] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#001237]"
            />
            <span className="leading-snug">
              I agree to the{' '}
              <Link
                href="/governance"
                target="_blank"
                className="font-semibold text-[#001237] hover:underline"
              >
                Terms of Use
              </Link>{' '}
              and acknowledge the{' '}
              <Link
                href="/governance"
                target="_blank"
                className="font-semibold text-[#001237] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p className="text-[11px] text-rose-600 font-medium pl-6">
              {errors.terms}
            </p>
          )}
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3.5 px-6 rounded-xl bg-[#001237] hover:bg-[#18243D] active:scale-[0.99] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer font-['Encode_Sans_Condensed',sans-serif] uppercase"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating account…</span>
            </div>
          ) : (
            <span>{accountType === 'stakeholder' ? 'Create Stakeholder Account' : 'Create Engineer Account'}</span>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="text-center pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#001237] hover:text-[#4FAAA7] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
