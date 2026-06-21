'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';
import FinancialParticles from '@/components/three/FinancialParticles';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const title = titleRef.current;
      const cta = ctaRef.current;
      const stats = statsRef.current;
      const subtitle = subtitleRef.current;
      if (!title || !cta || !stats || !subtitle) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        title.querySelectorAll('.line'),
        { y: 80, opacity: 0, rotateX: -15 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.15, transformOrigin: 'left center' }
      )
        .fromTo(subtitle, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.4')
        .fromTo(cta.querySelectorAll('.cta-item'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .fromTo(
          stats.querySelectorAll('.stat-item'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
          '-=0.2'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      <FinancialParticles />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1e]/50 to-[#0a0f1e]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Personal Finance Platform</span>
          </div>

          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6"
          >
            <span className="line block text-white">Your Money Deserves</span>
            <span className="line block">
              <span className="text-gradient">Better Decisions.</span>
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Track expenses, understand spending habits, and build financial discipline
            with intelligent insights powered by real-time analytics.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="cta-item">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 py-6 text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="cta-item">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 rounded-xl px-8 py-6 text-base font-semibold"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: '₹2.4B+', label: 'Tracked' },
              { value: '50K+', label: 'Active Users' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0f1e] to-transparent" />
    </div>
  );
}
