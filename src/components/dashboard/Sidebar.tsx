'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { signOut } from '@/lib/supabase/queries';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  History,
  User,
  PiggyBank,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  X,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Wallet, label: 'Budgets', href: '/dashboard/budgets' },
  { icon: History, label: 'Transactions', href: '/dashboard/transactions' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toggleTheme = useStore((s) => s.toggleTheme);
  const theme = useStore((s) => s.theme);
  const mobileSidebarOpen = useStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useStore((s) => s.setMobileSidebarOpen);
  const collapsed = useStore((s) => s.sidebarCollapsed);
  const setCollapsed = useStore((s) => s.setSidebarCollapsed);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleNavClick = () => {
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.fromTo(
      sidebarRef.current.querySelectorAll('.nav-item'),
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          {!collapsed && <span className="font-bold text-sidebar-foreground">VaultIQ</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors max-md:hidden"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-1">
        <button
          onClick={toggleTheme}
          className="nav-item flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={handleSignOut}
          className="nav-item flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={cn(
          'flex flex-col transition-all duration-300 bg-sidebar border-r border-sidebar-border',
          'fixed left-0 top-0 h-full z-40',
          'max-md:max-w-[280px] max-md:w-3/4',
          collapsed ? 'md:w-[72px]' : 'md:w-[240px]',
          mobileSidebarOpen
            ? 'max-md:translate-x-0'
            : 'max-md:-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
