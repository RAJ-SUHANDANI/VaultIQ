'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.fromTo(
      sidebarRef.current.querySelectorAll('.nav-item'),
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300',
        'bg-sidebar border-r border-sidebar-border',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="font-bold text-sidebar-foreground">VaultIQ</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">V</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isDashboardRoot = item.href === '/' && pathname.startsWith('/') && !navItems.some((n) => n.href !== '/' && pathname.startsWith(n.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive || (item.href === '/' && pathname === '/')
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
    </aside>
  );
}
