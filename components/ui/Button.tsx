import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'teal' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#3B68DE] hover:bg-[#2e54b8] text-white shadow-sm border border-[#3B68DE]',
    teal:
      'bg-[#4FAAA7] hover:bg-[#3d918e] text-[#001237] font-semibold shadow-sm border border-[#4FAAA7]',
    secondary:
      'bg-[#18243D] hover:bg-[#223354] text-white border border-slate-700 shadow-sm',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 shadow-xs font-semibold',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-transparent',
    destructive:
      'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-xs',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const combinedClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={combinedClass} {...linkProps}>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </Link>
    );
  }

  const { disabled, ...buttonProps } = props as ButtonAsButton;

  return (
    <button
      className={combinedClass}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
