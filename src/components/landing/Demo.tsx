'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { BarChart3, Wallet, PieChart, TrendingUp } from 'lucide-react';
import FinanceOrb from '@/components/three/FinanceOrb';

gsap.registerPlugin(ScrollTrigger);

export function Demo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = contentRef.current?.querySelectorAll('.demo-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="demo" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#0d1525] to-[#0a0f1e]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-emerald-500/5 to-blue-500/5">
              <FinanceOrb />
            </div>
          </div>

          <div ref={contentRef} className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>See It In Action</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Experience the{' '}
              <span className="text-gradient">Future</span> of Finance
            </h2>

            <p className="text-gray-400 text-lg mb-8">
              Watch your financial world come alive with real-time data visualization,
              animated insights, and intelligent tracking.
            </p>

            {[
              {
                icon: Wallet,
                title: 'Real-Time Balance Tracking',
                desc: 'See your money move with live animations and instant updates.',
                color: '#10B981',
              },
              {
                icon: BarChart3,
                title: 'Intelligent Analytics',
                desc: 'AI-powered insights that help you understand every rupee.',
                color: '#3B82F6',
              },
              {
                icon: PieChart,
                title: 'Category Breakdown',
                desc: 'Beautiful visualizations of where your money actually goes.',
                color: '#8B5CF6',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  className="demo-card flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
