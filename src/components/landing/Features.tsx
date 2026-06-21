'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Wallet, Target, PiggyBank, Shield, Zap, BrainCircuit, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Wallet,
    title: 'Smart Tracking',
    description: 'Automatically categorize and track every expense with AI-powered recognition.',
    color: '#10B981',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Beautiful charts and insights that reveal your spending patterns at a glance.',
    color: '#3B82F6',
  },
  {
    icon: Target,
    title: 'Budget Mastery',
    description: 'Set intelligent budgets that adapt to your habits and financial goals.',
    color: '#F59E0B',
  },
  {
    icon: PiggyBank,
    title: 'Savings Goals',
    description: 'Visualize progress toward your financial dreams with animated trackers.',
    color: '#8B5CF6',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your financial data is encrypted and protected with enterprise-level security.',
    color: '#EC4899',
  },
  {
    icon: Zap,
    title: 'Real-Time Sync',
    description: 'All your devices stay in perfect sync with instant updates across platforms.',
    color: '#14B8A6',
  },
  {
    icon: BrainCircuit,
    title: 'AI Insights',
    description: 'Get personalized recommendations to optimize your spending and savings.',
    color: '#F97316',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Receive intelligent notifications when you exceed budgets or spot anomalies.',
    color: '#06B6D4',
  },
];

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const header = headerRef.current;
      const grid = gridRef.current;
      if (!header || !grid) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(header.querySelectorAll('.reveal'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 });

      tl.fromTo(
        grid.querySelectorAll('.feature-card'),
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.08 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0d1525] to-[#0a0f1e]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Everything You Need</span>
          </div>
          <h2 className="reveal text-3xl md:text-5xl font-bold text-white mb-4">
            Built for Financial
            <span className="text-gradient"> Freedom</span>
          </h2>
          <p className="reveal text-gray-400 text-lg">
            Powerful tools that help you take control of your finances, understand your habits,
            and make smarter decisions every day.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="feature-card group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 cursor-pointer"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}15, transparent 40%)`,
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
