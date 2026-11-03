import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CivoraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  href?: string;
  theme?: 'dark' | 'light'; // 'dark' = white text on dark navy, 'light' = royal blue text on white
  variant?: 'full' | 'mark';
  className?: string;
  priority?: boolean;
}

/**
 * Official Civora Brand Logo Component
 * Uses official vector-grade brand asset with isometric faceted prism and geometric wordmark.
 */
export function CivoraLogo({
  size = 'md',
  showTagline = false,
  href,
  theme = 'light',
  variant = 'full',
  className = '',
  priority = false,
}: CivoraLogoProps) {
  // Sizing definitions preserving the 1038:424 (2.45:1) aspect ratio for full logo, and 350:384 (0.91:1) for mark
  const fullDimensions = {
    sm: { w: 98, h: 40, tag: 'text-[9px]' },
    md: { w: 118, h: 48, tag: 'text-[10px]' },
    lg: { w: 142, h: 58, tag: 'text-[11px]' },
    xl: { w: 176, h: 72, tag: 'text-xs' },
  }[size];

  const markDimensions = {
    sm: { w: 28, h: 31 },
    md: { w: 34, h: 37 },
    lg: { w: 44, h: 48 },
    xl: { w: 52, h: 57 },
  }[size];

  const isFull = variant === 'full';
  const logoSrc = isFull
    ? theme === 'dark'
      ? '/images/brand_logo_white.png'
      : 'https://res.cloudinary.com/depeqzb6z/image/upload/v1793724813/Logo_Variation_Updated_n09pgy.png'
    : theme === 'dark'
      ? '/images/brand_mark_white.png'
      : '/images/brand_mark.png';

  const w = isFull ? fullDimensions.w : markDimensions.w;
  const h = isFull ? fullDimensions.h : markDimensions.h;

  const content = (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <div className="relative flex items-center transition-transform duration-300 group-hover:scale-[1.02]">
        <Image
          src={logoSrc}
          alt="Amijad Civora"
          width={w}
          height={h}
          priority={priority}
          unoptimized
          className="object-contain h-auto"
          style={{ width: `${w}px`, height: 'auto' }}
        />
      </div>

      {showTagline && (
        <span
          className={`mt-1 font-semibold tracking-wider uppercase font-['Encode_Sans_Condensed',sans-serif] ${
            theme === 'dark' ? 'text-slate-400' : 'text-[#18243D]'
          } ${fullDimensions.tag}`}
        >
          Intelligent Construction. Clearer Control.
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
