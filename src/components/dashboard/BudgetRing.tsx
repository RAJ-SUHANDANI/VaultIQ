'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface BudgetRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  amount?: string;
}

export function BudgetRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#10B981',
  bgColor = 'rgba(255,255,255,0.05)',
  label = '',
  amount = '',
}: BudgetRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (!circleRef.current) return;

    gsap.fromTo(
      circleRef.current,
      { strokeDasharray: circumference, strokeDashoffset: circumference },
      {
        strokeDashoffset: circumference - (clampedProgress / 100) * circumference,
        duration: 1.5,
        ease: 'power3.out',
      }
    );

    if (textRef.current) {
      gsap.fromTo(textRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' });
    }
  }, [clampedProgress, circumference]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        <div ref={textRef} className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-lg font-bold text-foreground">{Math.round(clampedProgress)}%</span>
        </div>
      </div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      {amount && <span className="text-xs font-medium text-foreground">{amount}</span>}
    </div>
  );
}
