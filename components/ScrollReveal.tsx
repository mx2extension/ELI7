'use client';
import { useEffect, useRef, ReactNode } from 'react';

type RevealVariant = 
  | 'fade-up' 
  | 'slide-left' 
  | 'slide-right' 
  | 'zoom-in' 
  | 'drop-down'
  | 'skew-up';

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  className?: string;
  once?: boolean; // whether it animates only once or every time it enters view
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translate3d(0, 0, 0) scale(1) skew(0deg, 0deg)';
          if (once) observer.unobserve(element);
        } else if (!once) {
          element.style.opacity = '0';
          element.style.transform = getInitialTransform(variant);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [variant, once]);

  // Define fancy starting coordinates based on the chosen variant
  function getInitialTransform(v: RevealVariant): string {
    switch (v) {
      case 'slide-left':
        return 'translate3d(-60px, 0, 0)'; // Sweeps in from the left
      case 'slide-right':
        return 'translate3d(60px, 0, 0)';  // Sweeps in from the right
      case 'zoom-in':
        return 'translate3d(0, 30px, 0) scale(0.9)'; // Pops up while zooming out slightly
      case 'drop-down':
        return 'translate3d(0, -50px, 0)'; // Drops down from above
      case 'skew-up':
        return 'translate3d(0, 40px, 0) skew(0deg, 3deg)'; // Dynamic tilt effect as it rises
      case 'fade-up':
      default:
        return 'translate3d(0, 35px, 0)';  // Smooth rise
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: getInitialTransform(variant),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}