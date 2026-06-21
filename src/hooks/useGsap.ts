'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimation(
  ref: React.RefObject<HTMLDivElement | null>,
  vars: gsap.TweenVars,
  deps: unknown[] = []
) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 30, ...vars.from }, { opacity: 1, y: 0, ...vars.to });
    }, ref);
    return () => ctx.revert();
  }, deps);
}

export function useScrollReveal(ref: React.RefObject<HTMLDivElement | null>, vars: gsap.TweenVars = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        ...vars,
      });
    }, ref);
    return () => ctx.revert();
  }, []);
}

export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options?: IntersectionObserverInit
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([e]) => setEntry(e), options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.threshold, options?.rootMargin]);

  return entry;
}

export function staggerChildren(
  parent: HTMLDivElement,
  staggerAmount = 0.08,
  fromVars: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    parent.children,
    { opacity: 0, y: 30, ...fromVars },
    { opacity: 1, y: 0, stagger: staggerAmount, duration: 0.6, ease: 'power3.out' }
  );
}
