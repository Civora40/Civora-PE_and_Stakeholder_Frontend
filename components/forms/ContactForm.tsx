'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';

const INQUIRY_OPTIONS: SelectOption[] = [
  {
    value: 'enterprise_pilot',
    label: 'Enterprise Platform Pilot',
    description: 'Multi-project evaluation & portfolio-wide governance',
    badge: 'Enterprise',
    badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
  },
  {
    value: 'project_deployment',
    label: 'Active Project Deployment',
    description: 'Immediate submittal intake & verification setup',
    badge: 'Immediate',
    badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  {
    value: 'compliance_audit',
    label: 'Technical Compliance & Audit',
    description: 'Engineering review standards & immutable evidence verification',
    badge: 'Standards',
    badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
  },
  {
    value: 'api_integration',
    label: 'BIM & ERP System Integration',
    description: 'Connecting field telemetry, Procore, or Autodesk construction cloud',
    badge: 'Technical',
    badgeColor: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  },
  {
    value: 'general_inquiry',
    label: 'General Inquiry',
    description: 'Questions regarding the Civora platform and roadmap',
  },
];

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [inquiryType, setInquiryType] = useState('enterprise_pilot');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState('CIV-849201');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid work email address.');
      return;
    }

    if (!organization.trim()) {
      setErrorMessage('Please provide your organization or engineering firm.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage('Please write a brief description of your project or inquiry (minimum 10 characters).');
      return;
    }

    setIsLoading(true);

    // Simulate sending inquiry to Civora advisory desk
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsLoading(false);
    setReferenceId(`CIV-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setOrganization('');
    setInquiryType('enterprise_pilot');
    setMessage('');
    setIsSuccess(false);
    setErrorMessage(null);
  };

  if (isSuccess) {
    return (
      <div className={`rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 text-center space-y-5 shadow-xl ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider font-['Encode_Sans_Condensed',sans-serif]">
            Inquiry Dispatched &bull; Reference #{referenceId}
          </span>
          <h3 className="text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
            Thank you, {fullName.split(' ')[0]}!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your inquiry regarding <span className="font-semibold text-[#001237]">{INQUIRY_OPTIONS.find((o) => o.value === inquiryType)?.label}</span> has been routed to our technical advisory team.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 max-w-sm mx-auto space-y-1 text-left">
          <div className="font-bold text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
            Response SLA Commitment:
          </div>
          <p className="text-slate-500">
            A project engineer will review your site parameters and respond to <span className="font-mono text-[#001237]">{email}</span> within 2 business hours.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-[#001237] bg-slate-100 hover:bg-slate-200 border border-slate-200 uppercase font-['Encode_Sans_Condensed',sans-serif] tracking-wider transition-colors cursor-pointer"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xl ${className}`}>
      <div className="mb-6 space-y-1">
        <h3 className="text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] uppercase">
          Request Project Consultation
        </h3>
        <p className="text-xs text-slate-500">
          Connect directly with our construction systems engineering specialists.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name & Organization Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700">
              Full Name *
            </label>
            <div className="relative">
              <input
                id="contact-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. David Sterling, PE"
                className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-org" className="block text-xs font-semibold text-slate-700">
              Organization / Engineering Firm *
            </label>
            <input
              id="contact-org"
              type="text"
              required
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Sterling Infrastructure Partners"
              className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Work Email */}
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700">
            Work Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. d.sterling@sterling-infra.com"
            className="w-full rounded-xl bg-white border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* Inquiry Classification Custom Select */}
        <div className="space-y-1.5">
          <CustomSelect
            id="contact-inquiry"
            label="Inquiry Scope & Deployment Type *"
            value={inquiryType}
            onChange={setInquiryType}
            options={INQUIRY_OPTIONS}
            variant="light"
          />
        </div>

        {/* Project Context & Requirements */}
        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700">
            Project Overview & Specific Questions *
          </label>
          <textarea
            id="contact-message"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your project scale, current reporting workflow challenges, or specific compliance requirements..."
            className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#001237] hover:bg-[#18243D] active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase font-['Encode_Sans_Condensed',sans-serif] shadow-lg shadow-[#001237]/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Technical Inquiry</span>
                <Send className="w-4 h-4 text-[#4FAAA7]" />
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-1 text-[11px] text-slate-400">
          Strictly confidential &bull; No marketing spam &bull; Direct technical response within 2 business hours
        </div>
      </form>
    </div>
  );
}
