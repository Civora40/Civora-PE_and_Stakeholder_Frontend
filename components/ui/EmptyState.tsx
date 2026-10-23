import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-xl mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 ring-8 ring-slate-50">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && (
        <div>
          {actionHref ? (
            <Button href={actionHref} size="sm" variant="primary">
              {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} size="sm" variant="primary">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
