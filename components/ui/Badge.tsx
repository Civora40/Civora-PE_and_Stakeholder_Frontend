import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'teal'
  | 'blue'
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    default: {
      bg: 'bg-[#18243D]',
      text: 'text-slate-300',
      border: 'border-slate-700/60',
      dotColor: 'bg-slate-400',
    },
    teal: {
      bg: 'bg-[#4FAAA7]/10',
      text: 'text-[#4FAAA7]',
      border: 'border-[#4FAAA7]/30',
      dotColor: 'bg-[#4FAAA7]',
    },
    blue: {
      bg: 'bg-[#3B68DE]/15',
      text: 'text-blue-300',
      border: 'border-[#3B68DE]/40',
      dotColor: 'bg-[#3B68DE]',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      dotColor: 'bg-amber-400',
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      dotColor: 'bg-rose-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      dotColor: 'bg-emerald-400',
    },
    slate: {
      bg: 'bg-slate-800/80',
      text: 'text-slate-400',
      border: 'border-slate-700',
      dotColor: 'bg-slate-500',
    },
  };

  const style = variantStyles[variant];
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeStyles} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dotColor} animate-pulse`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
