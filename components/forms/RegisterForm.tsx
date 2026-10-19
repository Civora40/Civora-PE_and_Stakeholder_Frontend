'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Check,
  HardHat,
  Building2,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';
import { UserRole } from '@/types';

const ROLE_OPTIONS: SelectOption[] = [
  {
    value: 'project_engineer',
    label: 'Project Engineer',
    description: 'Submittal intake, technical verification & clarification requests',
    badge: 'Reviewer',
    badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
    icon: <HardHat className="w-4 h-4 text-[#4FAAA7]" />,
  },
  {
    value: 'project_manager',
    label: 'Construction Project Manager',
    description: 'Operational tracking, bottlenecks & stage progression oversight',
    badge: 'Manager',
    badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    icon: <Building2 className="w-4 h-4 text-blue-600" />,
  },
  {
    value: 'reporting_team',
    label: 'Reporting Team',
    description: 'Structured report compilation from verified site evidence',
    badge: 'Author',
    badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    icon: <FileSpreadsheet className="w-4 h-4 text-amber-600" />,
  },
  {
    value: 'read_only_stakeholder',
    label: 'Executive & Client Stakeholder',
    description: 'View released compliance packages and final audit records',
    badge: 'Auditor',
    badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>('project_engineer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    if (!organization || organization.trim().length < 2) {
      setErrorMessage('Please specify your organization or engineering firm.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must acknowledge the civil engineering compliance standard.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          organization: organization.trim(),
          role,
          password,
          confirmPassword,
          agreeTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Registration failed. Please check your information.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('An unexpected error occurred during registration. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
          Join Civora Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-normal">
          Create your verified organization account
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        {/* Full Name & Organization Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="reg-name"
              className="block text-xs font-semibold text-slate-700"
            >
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Lin, PE"
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reg-org"
              className="block text-xs font-semibold text-slate-700"
            >
              Organization / Firm
            </label>
            <input
              id="reg-org"
              name="organization"
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Civora Infrastructure Ltd"
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Work Email */}
        <div className="space-y-1">
          <label
            htmlFor="reg-email"
            className="block text-xs font-semibold text-slate-700"
          >
            Your Work Email
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@firm.com"
            className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* Role Selector */}
        <CustomSelect
          id="reg-role"
          name="role"
          label="Primary Operational Role"
          value={role}
          onChange={(val) => setRole(val as UserRole)}
          options={ROLE_OPTIONS}
          variant="light"
        />

        {/* Passwords Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="reg-pass"
              className="block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-pass"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-white border border-slate-300 pl-3.5 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reg-confirm"
              className="block text-xs font-semibold text-slate-700"
            >
              Confirm
            </label>
            <input
              id="reg-confirm"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#001237] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#001237]"
            />
            <span className="leading-snug">
              I agree to the Civora civil engineering verification protocol and human review standards.
            </span>
          </label>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#001237] hover:bg-[#18243D] active:scale-[0.99] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer font-['Encode_Sans_Condensed',sans-serif] uppercase"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="text-center pt-2 border-t border-slate-100">
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
