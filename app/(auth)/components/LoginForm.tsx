'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.error || 'Invalid email or password. Please verify your credentials.'
        );
        setIsLoading(false);
        return;
      }

      // Redirect to onboarding questionnaire or dashboard
      const destination = data.redirectUrl || '/onboarding';
      router.push(destination);
      router.refresh();
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-[#001237] font-['Encode_Sans_Condensed',sans-serif] tracking-tight">
          Welcome Back to Civora!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-normal">
          Sign in your account
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

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-700"
          >
            Your Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="info.madhu786@gmail.com"
            className="w-full rounded-xl bg-white border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#001237] focus:ring-1 focus:ring-[#001237] focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#001237] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#001237]"
            />
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Remember Me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-slate-400 hover:text-slate-700 transition-colors font-medium"
          >
            Forgot Password?
          </Link>
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
            <span>Login</span>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <div className="text-center pt-2">
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
