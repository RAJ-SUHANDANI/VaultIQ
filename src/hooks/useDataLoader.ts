'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/shared/AuthProvider';
import { useStore } from '@/lib/store';
import { fetchCategories, fetchExpenses, fetchBudgets, fetchGoals, fetchProfile } from '@/lib/supabase/queries';

export function useDataLoader() {
  const { user, loading: authLoading } = useAuth();
  const loaded = useStore((s) => s.loaded);
  const setLoaded = useStore((s) => s.setLoaded);
  const setProfile = useStore((s) => s.setProfile);
  const setCategories = useStore((s) => s.setCategories);
  const setExpenses = useStore((s) => s.setExpenses);
  const setBudgets = useStore((s) => s.setBudgets);
  const setGoals = useStore((s) => s.setGoals);

  useEffect(() => {
    if (!user || authLoading || loaded) return;

    (async () => {
      try {
        const [profile, categories, expenses, budgets, goals] = await Promise.all([
          fetchProfile(),
          fetchCategories(),
          fetchExpenses(),
          fetchBudgets(),
          fetchGoals(),
        ]);
        setProfile(profile);
        setCategories(categories);
        setExpenses(expenses);
        setBudgets(budgets);
        setGoals(goals);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, [user, authLoading]);

  return { loading: authLoading || !loaded };
}
