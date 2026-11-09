'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResetConfirmed, setIsResetConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfirmMode = Boolean(initialToken);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'Unable to process password reset request.');
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetToken.trim()) {
      setErrorMessage('A valid password reset token is required.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm',
          token: resetToken.trim(),
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(
          data.error || 'Invalid or expired reset token. Please request a new reset link.'
        );
        setIsLoading(false);
        return;
      }

      setIsResetConfirmed(true);
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetConfirmed) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
              Password Updated
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your Civora account password has been updated and active sessions have been refreshed. You can now sign in with your new credentials.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full py-3.5 px-6 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-['Encode_Sans_Condensed',sans-serif] uppercase"
            >
              Sign In to Civora
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
            Check Your Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Password recovery instructions dispatched
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#001237]">Reset Link Dispatched</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an authorized Civora account exists for{' '}
                <span className="font-semibold text-[#001237]">{email}</span>, password reset instructions have been sent.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full py-3.5 px-6 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-['Encode_Sans_Condensed',sans-serif] uppercase"
            >
              Return to Sign In
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setErrorMessage(null);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
            >
              Try a different email address
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
          {isConfirmMode ? 'Set a New Password' : 'Forgot Your Password?'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-normal">
          {isConfirmMode
            ? 'Enter a new password for your Civora account.'
            : 'Enter the work email associated with your Civora account and we will send you a reset link.'}
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isConfirmMode ? (
        <form onSubmit={handleConfirmReset} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="block text-xs font-semibold text-slate-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl bg-white border border-slate-300 pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirm-new-password"
              className="block text-xs font-semibold text-slate-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirm-new-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full rounded-xl bg-white border border-slate-300 pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#001237] hover:bg-[#18243D] active:scale-[0.99] text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer font-['Encode_Sans_Condensed',sans-serif] uppercase"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="recovery-email"
              className="block text-xs font-semibold text-slate-700"
            >
              Your Email
            </label>
            <input
              id="recovery-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
            />
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
              <span>Send Reset Link</span>
            )}
          </button>
        </form>
      )}

      {/* Bottom Switch Links */}
      <div className="pt-2 space-y-3 text-center">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#001237] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          Don&apos;t have any account?{' '}
          <Link
            href="/register"
            className="font-bold text-[#001237] hover:text-[#4FAAA7] transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

