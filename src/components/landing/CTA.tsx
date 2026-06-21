'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, CreditCard, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      gsap.fromTo(
        sectionRef.current.querySelectorAll('.cta-anim'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] to-[#0d1525]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="cta-anim inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
          <Users className="w-4 h-4" />
          <span>Join 50,000+ Users</span>
        </div>

        <h2 className="cta-anim text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Ready to Master{' '}
          <span className="text-gradient">Every Decision?</span>
        </h2>

        <p className="cta-anim text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Start your journey to financial freedom today. No credit card required.
          Join thousands of smart money managers.
        </p>

        <div className="cta-anim flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-8 py-6 text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 rounded-xl px-8 py-6 text-base font-semibold"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="cta-anim flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Bank-grade encryption
          </span>
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            No hidden fees
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            50K+ happy users
          </span>
        </div>
      </div>
    </section>
  );
}
