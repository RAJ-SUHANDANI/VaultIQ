'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { createExpense, deleteExpense } from '@/lib/supabase/queries';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ExpenseModal } from '@/components/dashboard/ExpenseModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Receipt,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { profile, expenses, budgets, categories, addExpense, removeExpense } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<any>(null);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyExpenses = useMemo(
    () => expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }),
    [expenses, currentMonth, currentYear]
  );

  const totalSpent = useMemo(() => monthlyExpenses.reduce((s, e) => s + e.amount, 0), [monthlyExpenses]);
  const income = profile?.monthly_income || 0;
  const savings = income - totalSpent;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const totalBudget = useMemo(
    () => budgets.filter((b) => b.month === currentMonth + 1 && b.year === currentYear).reduce((s, b) => s + b.amount, 0),
    [budgets, currentMonth, currentYear]
  );
  const budgetUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const recentExpenses = useMemo(() => [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [expenses]);

  const getCategoryInfo = (categoryId: string) => categories.find((c) => c.id === categoryId);

  const handleAddExpense = async (data: any) => {
    const created = await createExpense(data);
    if (created) {
      addExpense(created);
      toast.success('Expense added');
      setModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    removeExpense(id);
    toast.success('Expense deleted');
  };

  const handleEdit = (expense: any) => {
    setEditExpense(expense);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {profile?.name || 'User'}! Here&apos;s your financial overview.
          </p>
        </div>
        <Button
          onClick={() => { setEditExpense(null); setModalOpen(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/25"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Current Balance" value={income - totalSpent} icon={Wallet} trend={12} trendLabel="projected" color="#10B981" delay={0} />
        <MetricCard title="Monthly Spending" value={totalSpent} icon={TrendingDown} trend={-8} trendLabel="vs last month" color="#EF4444" delay={1} />
        <MetricCard title="Monthly Savings" value={Math.max(0, savings)} icon={PiggyBank} trend={Math.round(savingsRate)} trendLabel="savings rate" color="#3B82F6" delay={2} />
        <MetricCard title="Budget Usage" value={budgetUsage} suffix="%" icon={TrendingUp} trend={Math.round(budgetUsage)} trendLabel="of budget used" color="#F59E0B" delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border bg-card rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-foreground">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center gap-2">
                <Receipt className="h-8 w-8 opacity-30" />
                <p>No transactions yet. Add your first expense!</p>
              </div>
            ) : (
              <ScrollArea className="h-[320px]">
                <div className="space-y-1">
                  {recentExpenses.map((expense) => {
                    const cat = getCategoryInfo(expense.category_id);
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${cat?.color}15` }}>
                            <span>{cat?.icon || '📌'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(expense.date)} · {cat?.name || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{formatCurrency(expense.amount, profile?.currency || '₹')}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-muted transition-all">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem onClick={() => handleEdit(expense)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400" onClick={() => handleDelete(expense.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-xs text-emerald-400 mb-1">Monthly Income</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(income, profile?.currency || '₹')}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-xs text-blue-400 mb-1">Total Transactions</p>
              <p className="text-xl font-bold text-foreground">{expenses.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <p className="text-xs text-purple-400 mb-1">Categories Used</p>
              <p className="text-xl font-bold text-foreground">{new Set(expenses.map((e) => e.category_id)).size}</p>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-xs text-orange-400 mb-1">Budget Categories</p>
              <p className="text-xl font-bold text-foreground">{budgets.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExpenseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditExpense(null); }}
        editExpense={editExpense}
        onSave={handleAddExpense}
      />
    </div>
  );
}
