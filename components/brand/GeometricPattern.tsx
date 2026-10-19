import React from 'react';

interface GeometricPatternProps {
  variant?: 'grid' | 'isometric' | 'nodes';
  className?: string;
}

/**
 * Geometric Pattern Asset Component
 *
 * NOTE ON ASSETS:
 * Conforms to Civora Brand Guideline: "Keep patterns subtle and away from dense content."
 * Provides subtle architectural guidelines and isometric coordinate grids in Muted Teal / Deep Steel Navy.
 */
export function GeometricPattern({
  variant = 'grid',
  className = '',
}: GeometricPatternProps) {
  if (variant === 'isometric') {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none opacity-[0.04] ${className}`}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="civora-iso-pattern"
              width="60"
              height="104"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1)"
            >
              <path
                d="M30 0 L60 52 L30 104 L0 52 Z"
                fill="none"
                stroke="#4FAAA7"
                strokeWidth="1"
              />
              <path
                d="M0 52 L60 52 M30 0 L30 104"
                fill="none"
                stroke="#3B68DE"
                strokeWidth="0.75"
                strokeDasharray="2 4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#civora-iso-pattern)" />
        </svg>
      </div>
    );
  }

  if (variant === 'nodes') {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none opacity-[0.06] ${className}`}
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="civora-nodes-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="40" cy="40" r="1.5" fill="#4FAAA7" />
              <path
                d="M35 40 H45 M40 35 V45"
                stroke="#3B68DE"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#civora-nodes-pattern)" />
        </svg>
      </div>
    );
  }

  // Default coordinate structural grid
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none opacity-[0.05] ${className}`}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="civora-grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#4FAAA7"
              strokeWidth="0.75"
            />
            <circle cx="0" cy="0" r="1" fill="#3B68DE" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#civora-grid-pattern)" />
      </svg>
    </div>
  );
}
