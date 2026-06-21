import { create } from 'zustand';
import type { Expense, Budget, Goal, Category, Profile } from './types';

interface AppState {
  profile: Profile | null;
  categories: Category[];
  expenses: Expense[];
  budgets: Budget[];
  goals: Goal[];

  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  loaded: boolean;

  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileSidebarOpen: (v: boolean) => void;

  setProfile: (p: Profile | null) => void;
  setCategories: (c: Category[]) => void;
  setExpenses: (e: Expense[]) => void;
  setBudgets: (b: Budget[]) => void;
  setGoals: (g: Goal[]) => void;
  setLoaded: (v: boolean) => void;

  addExpense: (e: Expense) => void;
  updateExpenseInStore: (id: string, updates: Partial<Expense>) => void;
  removeExpense: (id: string) => void;

  addBudget: (b: Budget) => void;
  updateBudgetInStore: (id: string, updates: Partial<Budget>) => void;

  addGoal: (g: Goal) => void;
  updateGoalInStore: (id: string, updates: Partial<Goal>) => void;
  removeGoal: (id: string) => void;

  addCategory: (c: Category) => void;
  removeCategory: (id: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  categories: [],
  expenses: [],
  budgets: [],
  goals: [],
  theme: 'dark',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  loaded: false,

  setTheme: (t) => {
    set({ theme: t });
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(t);
    }
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),

  setProfile: (p) => set({ profile: p }),
  setCategories: (c) => set({ categories: c }),
  setExpenses: (e) => set({ expenses: e }),
  setBudgets: (b) => set({ budgets: b }),
  setGoals: (g) => set({ goals: g }),
  setLoaded: (v) => set({ loaded: v }),

  addExpense: (e) => set((s) => ({ expenses: [e, ...s.expenses] })),
  updateExpenseInStore: (id, updates) =>
    set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)) })),
  removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

  addBudget: (b) => {
    const exists = get().budgets.find((x) => x.category_id === b.category_id && x.month === b.month && x.year === b.year);
    if (exists) {
      set((s) => ({ budgets: s.budgets.map((x) => (x.id === exists.id ? b : x)) }));
    } else {
      set((s) => ({ budgets: [...s.budgets, b] }));
    }
  },
  updateBudgetInStore: (id, updates) =>
    set((s) => ({ budgets: s.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)) })),

  addGoal: (g) => set((s) => ({ goals: [...s.goals, g] })),
  updateGoalInStore: (id, updates) =>
    set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)) })),
  removeGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

  addCategory: (c) => set((s) => ({ categories: [...s.categories, c] })),
  removeCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
}));
