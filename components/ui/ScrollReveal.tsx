'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-up-subtle' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'zoom-fade';
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  className?: string;
  threshold?: number;
  rootMargin?: string;
  easing?: string;
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  threshold = 0.12,
  rootMargin = '0px 0px -50px 0px',
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      if (!('IntersectionObserver' in window)) return true;
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
      }
    }
    return false;
  });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const getAnimationStyles = () => {
    const baseTransition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

    const initialTransforms = {
      'fade-up': 'translate3d(0, 36px, 0)',
      'fade-up-subtle': 'translate3d(0, 18px, 0)',
      'fade-in': 'translate3d(0, 0, 0)',
      'slide-left': 'translate3d(-36px, 0, 0)',
      'slide-right': 'translate3d(36px, 0, 0)',
      'scale-up': 'scale(0.94) translate3d(0, 16px, 0)',
      'zoom-fade': 'scale(0.92)',
    };

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : initialTransforms[animation],
      transition: baseTransition,
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform',
    };
  };

  return (
    <div ref={elementRef} style={getAnimationStyles()} className={className}>
      {children}
    </div>
  );
}

