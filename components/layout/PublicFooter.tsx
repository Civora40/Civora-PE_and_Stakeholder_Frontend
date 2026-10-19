import React from 'react';
import Link from 'next/link';
import { CivoraLogo } from '@/components/brand/CivoraLogo';
import { ShieldCheck, HardHat, CheckCircle2 } from 'lucide-react';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc] text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <CivoraLogo size="md" showTagline={true} theme="light" />
            <p className="text-sm text-slate-600 max-w-md leading-relaxed mt-2 font-normal">
              A structured workspace for construction site submissions, review workflows, and project reporting.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
              <span className="flex items-center gap-1.5 font-semibold text-[#18243D]">
                <ShieldCheck className="w-4 h-4 text-[#4FAAA7]" />
                Preserve the Source
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#001237]">
                <HardHat className="w-4 h-4 text-[#3B68DE]" />
                Accountable Human Review
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/platform" className="hover:text-[#4FAAA7] transition-colors">
                  Platform
                </Link>
              </li>
              <li>
                <Link href="/capabilities" className="hover:text-[#4FAAA7] transition-colors">
                  Capabilities
                </Link>
              </li>
              <li>
                <Link href="/workflow" className="hover:text-[#4FAAA7] transition-colors">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/governance" className="hover:text-[#4FAAA7] transition-colors">
                  Governance
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-[#4FAAA7] font-bold hover:underline">
                  Register on Platform &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Access & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#001237] font-['Encode_Sans_Condensed',sans-serif]">
              Account Access
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/login" className="hover:text-[#4FAAA7] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-[#4FAAA7] transition-colors">
                  Password Recovery
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full font-medium mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Systems Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Compliance Note */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} Civora. All rights reserved.
          </p>
          <div className="text-right text-[11px] text-slate-500 max-w-md">
            Civora — Intelligent Construction. Clearer Control.
          </div>
        </div>
      </div>
    </footer>
  );
}
