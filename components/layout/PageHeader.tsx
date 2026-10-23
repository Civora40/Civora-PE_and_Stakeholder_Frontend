import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode; // Action buttons or filters on the right
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 ${className}`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold font-['Encode_Sans_Condensed',sans-serif] text-[#001237] tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {children}
        </div>
      )}
    </div>
  );
}
