'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/shared/AuthProvider';
import { useDataLoader } from '@/hooks/useDataLoader';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useDataLoader();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[240px] transition-all duration-300">
        <Header />
        <main className="p-4 md:p-6 lg:p-8">
          {dataLoading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
                <p className="text-sm text-muted-foreground">Loading your finances...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
