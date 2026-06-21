'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  prefix = '₹',
  suffix = '',
  icon: Icon,
  trend,
  trendLabel = '',
  color = '#10B981',
  delay = 0,
}: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: delay * 0.1,
        ease: 'power3.out',
      }
    );
  }, [delay]);

  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div
      ref={cardRef}
      className="group relative p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="text-2xl font-bold text-foreground">
        <AnimatedCounter to={value} prefix={prefix} suffix={suffix} duration={1.5} />
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              isPositive && 'text-emerald-400',
              isNegative && 'text-red-400'
            )}
          >
            <svg
              className={cn('w-3 h-3', isNegative && 'rotate-180')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
