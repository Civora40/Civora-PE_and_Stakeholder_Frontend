import React from 'react';
import { Clock, Shield, LogOut, ArrowRight, RefreshCw, Mail } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { CivoraLogo } from '@/components/brand/CivoraLogo';

export const metadata = {
  title: 'Access Pending | Civora Control Plane',
  description: 'Your Civora stakeholder account is awaiting project access activation.',
};

export default async function AccessPendingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#001237] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['Inter',sans-serif]">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B68DE]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center space-y-4 relative z-10">
        <CivoraLogo size="md" showTagline={true} href="/" theme="dark" className="justify-center" />

        <div className="rounded-2xl bg-[#18243D]/95 border border-[#4FAAA7]/30 p-8 shadow-2xl backdrop-blur-md space-y-6 mt-6 text-left">
          {/* Status Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Access Pending
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide mt-1">
                Project Access Pending
              </h1>
            </div>
          </div>

          {/* Copy from Section 5 of Spec */}
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-700/80 pt-4">
            <p>
              Your account setup is complete, but project access has not been activated yet. You’ll be able to view project updates once an authorized project administrator confirms your access.
            </p>
            <p className="text-slate-400 text-[11px]">
              When an authorized administrator assigns your organization to an active capital project, your stakeholder dashboard will automatically unlock.
            </p>
          </div>

          {/* User Account Info */}
          {user && (
            <div className="rounded-xl bg-[#001237]/80 border border-slate-700/80 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Stakeholder Account:</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Verified Email:</span>
                <span className="font-mono text-slate-200">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Membership Status:</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Awaiting Assignment
                </span>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#4FAAA7] hover:bg-[#4FAAA7]/90 text-[#001237] text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check Access Status</span>
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#4FAAA7]" />
            <span>Questions? Contact the project administrator who issued your invite.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
