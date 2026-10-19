'use client';

import React, { useState } from 'react';
import { Info, ShieldAlert, X } from 'lucide-react';

interface DemoDataIndicatorProps {
  className?: string;
}

/**
 * Demo Data Indicator Component
 *
 * Requirements:
 * "If data is mocked, isolate fixtures in a development-only module and show a 'Demo data' indicator.
 * Do not present mock data as live customer data."
 */
export function DemoDataIndicator({ className = '' }: DemoDataIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
        title="Notice: Operating in Demonstration & Development Mode"
        aria-label="View demo data notice"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>Demo Data Active</span>
        <Info className="w-3 h-3 text-amber-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-xl bg-[#18243D] border border-amber-500/40 shadow-2xl z-50 text-xs text-slate-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Isolated Demo Environment</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed mb-2">
              The projects, test logs, submittals, and inspection records shown here are simulated
              development fixtures for evaluating the Civora UI and RBAC workflows.
            </p>
            <div className="p-2 rounded bg-[#001237] border border-slate-700/60 font-mono text-[11px] text-[#4FAAA7]">
              Source: lib/mock-data/fixtures.ts
            </div>
          </div>
        </>
      )}
    </div>
  );
}
