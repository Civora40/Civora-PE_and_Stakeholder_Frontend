'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CivoraUser } from '@/types';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

interface DashboardShellProps {
  user: CivoraUser;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] print:bg-white text-slate-900 flex flex-col print:block font-['Inter',sans-serif] selection:bg-[#4FAAA7]/20 selection:text-slate-900 print:min-h-0 print:p-0 print:m-0">
      {/* Sidebar matching reference UI (Hidden during print) */}
      <div className="print:hidden">
        <AppSidebar
          user={user}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Main Container */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 print:pl-0 print:m-0 print:w-full print:block ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header (Hidden during print) */}
        <div className="print:hidden">
          <AppHeader
            user={user}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 max-w-[1500px] print:max-w-none w-full mx-auto space-y-6 print:space-y-0 print:block">
          {children}
        </main>
      </div>
    </div>
  );
}
