'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { GeometricPattern } from '@/components/brand/GeometricPattern';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate recovery link dispatch
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#001237] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <GeometricPattern variant="grid" className="inset-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-4">
        <CivoraLogo size="md" showTagline={true} href="/" theme="dark" className="justify-center" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Encode_Sans_Condensed',sans-serif] uppercase pt-2">
          Password Recovery
        </h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Enter your certified work email to receive cryptographic password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="rounded-2xl bg-[#18243D]/90 border border-slate-700/80 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10 space-y-6">
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white">Reset Link Dispatched</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                If an authorized user account exists for <span className="text-[#4FAAA7] font-semibold">{email}</span>, an authenticated reset dispatch has been queued.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <Button href="/login" variant="teal" size="md" className="w-full justify-center">
                  Return to Sign In
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="recovery-email"
                  className="block text-xs font-semibold text-slate-200 uppercase tracking-wider"
                >
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. engineer@civora.internal"
                    className="w-full rounded-lg bg-[#001237] border border-slate-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#4FAAA7] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                size="md"
                isLoading={isLoading}
                className="w-full justify-center"
              >
                Send Password Reset Email
              </Button>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 hover:text-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
                <span className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3 h-3 text-[#4FAAA7]" />
                  Internal Identity
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
