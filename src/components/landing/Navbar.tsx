'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(navRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      rotation: scrolled ? 0 : 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [scrolled]);

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0a0f1e]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <svg
              ref={logoRef}
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="34" y2="34">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              {/* Shield background */}
              <path
                d="M17 2L30.5 9.5V16C30.5 24.5 24.5 30.5 17 33C9.5 30.5 3.5 24.5 3.5 16V9.5L17 2Z"
                fill="url(#logo-grad)"
                className="transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              />
              {/* Inner accent */}
              <path
                d="M17 5.5L28 11.5V16C28 22.5 23 27.5 17 29.5C11 27.5 6 22.5 6 16V11.5L17 5.5Z"
                fill="#0a0f1e"
                opacity="0.3"
              />
              {/* V letter */}
              <path
                d="M12 13L17 23L22 13"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 group-hover:stroke-emerald-200"
              />
              {/* Small dot accent */}
              <circle cx="17" cy="11" r="1.5" fill="#10B981" />
            </svg>
            <span className="text-lg font-bold text-white tracking-tight">
              Vault<span className="text-emerald-400">IQ</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '#features', label: 'Features' },
              { href: '#demo', label: 'Demo' },
              { href: '#pricing', label: 'Pricing' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-white/10 mx-3" />
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/5 rounded-xl px-5"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#0a0f1e]/95 backdrop-blur-2xl border-t border-white/5 shadow-2xl">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="#features"
              className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              onClick={() => setOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              onClick={() => setOpen(false)}
            >
              Demo
            </Link>
            <div className="h-px bg-white/5 my-2" />
            <Link
              href="/login"
              className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="block pt-2">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
