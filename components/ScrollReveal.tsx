
'use client';

import {
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

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
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

function getInitialTransform(variant: RevealVariant): string {
  switch (variant) {
    case 'slide-left':
      return 'translate3d(-60px, 0, 0)';

    case 'slide-right':
      return 'translate3d(60px, 0, 0)';

    case 'zoom-in':
      return 'translate3d(0, 30px, 0) scale(0.9)';

    case 'drop-down':
      return 'translate3d(0, -50px, 0)';

    case 'skew-up':
      return 'translate3d(0, 40px, 0) skew(0deg, 3deg)';

    case 'fade-up':
    default:
      return 'translate3d(0, 35px, 0)';
  }
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

          element.style.transform =
            'translate3d(0, 0, 0) scale(1) skew(0deg, 0deg)';

          if (once) {
            observer.unobserve(element);
          }

        } else if (!once) {

          element.style.opacity = '0';

          element.style.transform =
            getInitialTransform(variant);

        }

      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };

  }, [variant, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: getInitialTransform(variant),

        transition: `
          opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
          transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms
        `,

        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
