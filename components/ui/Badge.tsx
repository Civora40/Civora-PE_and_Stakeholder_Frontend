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
      bg: 'bg-[#4FAAA7]/15',
      text: 'text-teal-900',
      border: 'border-[#4FAAA7]/40',
      dotColor: 'bg-[#4FAAA7]',
    },
    blue: {
      bg: 'bg-[#3B68DE]/15',
      text: 'text-blue-800',
      border: 'border-[#3B68DE]/30',
      dotColor: 'bg-[#3B68DE]',
    },
    amber: {
      bg: 'bg-[#4FAAA7]/15',
      text: 'text-teal-900',
      border: 'border-[#4FAAA7]/40',
      dotColor: 'bg-[#4FAAA7]',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dotColor: 'bg-rose-500',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
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
