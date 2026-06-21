'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useIntersectionObserver } from '@/hooks/useGsap';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const entry = useIntersectionObserver(ref, { threshold: 0.3 });

  useEffect(() => {
    if (!entry?.isIntersecting) return;
    const el = ref.current;
    if (!el) return;

    const obj = { val: from };
    gsap.to(obj, {
      val: to,
      duration,
      ease: 'power3.out',
      onUpdate: () => {
        el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
      },
    });
  }, [from, to, duration, decimals, prefix, suffix, entry?.isIntersecting]);

  return <span ref={ref} className={className}>{`${prefix}${to.toFixed(decimals)}${suffix}`}</span>;
}
