import { createClient as sb, restSignUp, restSignIn } from './client';
import type { Expense, Budget, Goal, Category, Profile } from '@/lib/types';

// ─── Categories ───────────────────────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await sb()
    .from('categories')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name');
  return (data as Category[]) ?? [];
}

export async function createCategory(name: string, icon: string, color: string) {
  const user_id = await currentUserId();
  const { data } = await sb()
    .from('categories')
    .insert({ name, icon, color, user_id } as never)
    .select()
    .single();
  return data as Category | null;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  await sb().from('categories').update(updates as never).eq('id', id);
}

export async function deleteCategory(id: string) {
  await sb().from('categories').delete().eq('id', id);
}

// ─── Expenses ─────────────────────────────────────────────
export async function fetchExpenses(): Promise<Expense[]> {
  const { data } = await sb()
    .from('expenses')
    .select('*, categories(name, icon, color)')
    .order('date', { ascending: false });
  return (data as Expense[]) ?? [];
}

async function currentUserId() {
  const { data } = await sb().auth.getUser();
  return data.user?.id;
}

export async function createExpense(expense: {
  amount: number;
  description: string;
  category_id: string;
  date: string;
  notes?: string;
}) {
  const user_id = await currentUserId();
  const { data } = await sb()
    .from('expenses')
    .insert({ ...expense, user_id } as never)
    .select('*, categories(name, icon, color)')
    .single();
  return data as Expense | null;
}

export async function updateExpense(id: string, updates: Partial<Expense>) {
  const { data } = await sb()
    .from('expenses')
    .update(updates as never)
    .eq('id', id)
    .select('*, categories(name, icon, color)')
    .single();
  return data as Expense | null;
}

export async function deleteExpense(id: string) {
  await sb().from('expenses').delete().eq('id', id);
}

// ─── Budgets ──────────────────────────────────────────────
export async function fetchBudgets(): Promise<Budget[]> {
  const { data } = await sb()
    .from('budgets')
    .select('*, categories(name, icon, color)')
    .order('month', { ascending: false });
  return (data as Budget[]) ?? [];
}

export async function upsertBudget(budget: {
  category_id: string;
  amount: number;
  month: number;
  year: number;
}) {
  const user_id = await currentUserId();
  const { data } = await sb()
    .from('budgets')
    .upsert({ ...budget, user_id } as never, {
      onConflict: 'user_id,category_id,month,year',
      ignoreDuplicates: false,
    })
    .select('*, categories(name, icon, color)')
    .single();
  return data as Budget | null;
}

// ─── Savings Goals ────────────────────────────────────────
export async function fetchGoals(): Promise<Goal[]> {
  const { data } = await sb()
    .from('savings_goals')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Goal[]) ?? [];
}

export async function createGoal(goal: {
  name: string;
  target_amount: number;
  deadline?: string;
  color?: string;
}) {
  const user_id = await currentUserId();
  const { data } = await sb()
    .from('savings_goals')
    .insert({ ...goal, user_id } as never)
    .select()
    .single();
  return data as Goal | null;
}

export async function updateGoal(id: string, updates: Partial<Goal>) {
  const { data } = await sb()
    .from('savings_goals')
    .update(updates as never)
    .eq('id', id)
    .select()
    .single();
  return data as Goal | null;
}

export async function deleteGoal(id: string) {
  await sb().from('savings_goals').delete().eq('id', id);
}

// ─── Profile ──────────────────────────────────────────────
export async function fetchProfile() {
  const { data } = await sb()
    .from('profiles')
    .select('*')
    .single();
  return data as Profile | null;
}

export async function updateProfile(updates: { name?: string; currency?: string; monthly_income?: number }) {
  const { data } = await sb()
    .from('profiles')
    .update(updates as never)
    .select()
    .single();
  return data;
}

// ─── Auth helpers ─────────────────────────────────────────
export async function signUp(email: string, password: string, name: string) {
  return restSignUp(email, password, name);
}

export async function signIn(email: string, password: string) {
  return restSignIn(email, password);
}

export async function signOut() {
  try { await sb().auth.signOut(); } catch { /* ignore */ }
}

export async function getCurrentUser() {
  const { data } = await sb().auth.getUser();
  return data.user;
}
