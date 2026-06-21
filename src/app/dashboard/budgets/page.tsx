'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';
import { upsertBudget, createGoal, updateGoal as updateGoalQuery, deleteGoal as deleteGoalQuery } from '@/lib/supabase/queries';
import { BudgetRing } from '@/components/dashboard/BudgetRing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency, getCurrentMonth, getCurrentYear } from '@/lib/utils';
import type { Category } from '@/lib/types';
import { Plus, Target, Trash2, PiggyBank, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const { categories: allCategories, budgets, goals, profile, addBudget, addGoal, updateGoalInStore, removeGoal } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  const [budgetCatId, setBudgetCatId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalColor, setGoalColor] = useState('#10B981');

  const currentMonth = getCurrentMonth() + 1;
  const currentYear = getCurrentYear();

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.budget-anim'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
    );
  }, []);

  const categories = allCategories.filter((c) => !c.is_default || true);

  const currentBudgets = useMemo(
    () => budgets.filter((b) => b.month === currentMonth && b.year === currentYear),
    [budgets, currentMonth, currentYear]
  );

  // Calculate spent per category from expenses
  const { expenses } = useStore();
  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      if (d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear) {
        map[e.category_id] = (map[e.category_id] || 0) + e.amount;
      }
    });
    return map;
  }, [expenses, currentMonth, currentYear]);

  const handleAddBudget = async () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0 || !budgetCatId) {
      toast.error('Please enter a valid amount and select a category');
      return;
    }
    const created = await upsertBudget({ category_id: budgetCatId, amount, month: currentMonth, year: currentYear });
    if (created) {
      addBudget(created);
      toast.success('Budget set');
      setBudgetDialogOpen(false);
      setBudgetAmount('');
    }
  };

  const handleAddGoal = async () => {
    const target = parseFloat(goalTarget);
    if (!goalName.trim() || isNaN(target) || target <= 0) {
      toast.error('Please fill in all fields');
      return;
    }
    const created = await createGoal({ name: goalName.trim(), target_amount: target, deadline: goalDeadline || undefined, color: goalColor });
    if (created) {
      addGoal(created);
      toast.success('Goal created');
      setGoalDialogOpen(false);
      setGoalName('');
      setGoalTarget('');
      setGoalDeadline('');
    }
  };

  const handleAddToGoal = async (goalId: string, amount: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const newCurrent = Math.min(goal.current_amount + amount, goal.target_amount);
    const updated = await updateGoalQuery(goalId, { current_amount: newCurrent });
    if (updated) {
      updateGoalInStore(goalId, updated);
      toast.success(`₹${amount.toLocaleString()} added to ${goal.name}`);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    await deleteGoalQuery(id);
    removeGoal(id);
    toast.success('Goal deleted');
  };

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#EF4444'];

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="budget-anim flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget Center</h1>
          <p className="text-sm text-muted-foreground">Track your budgets and savings goals</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
            <DialogTrigger><Button variant="outline" className="rounded-xl border-border"><Plus className="mr-2 h-4 w-4" />Add Budget</Button></DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">Set Monthly Budget</DialogTitle>
                <DialogDescription className="text-muted-foreground">Define a spending limit for a category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                    <Select value={budgetCatId} onValueChange={(v) => v && setBudgetCatId(v)}>
                    <SelectTrigger className="bg-muted/50 border-border rounded-xl">
                      <SelectValue placeholder="Select category">
                        {(v: any) => {
                          const cat = allCategories.find((c) => c.id === v);
                          return cat ? (
                            <span className="flex items-center gap-2"><span>{cat.icon}</span><span>{cat.name}</span></span>
                          ) : (
                            <span className="text-muted-foreground">Select category</span>
                          );
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2"><span>{cat.icon}</span><span>{cat.name}</span></span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Limit (₹)</Label>
                  <Input type="number" placeholder="10000" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)}
                    className="bg-muted/50 border-border rounded-xl" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBudgetDialogOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleAddBudget} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">Set Budget</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
            <DialogTrigger><Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"><Target className="mr-2 h-4 w-4" />New Goal</Button></DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-card border-border rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create Savings Goal</DialogTitle>
                <DialogDescription className="text-muted-foreground">Set a financial goal and track your progress</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Goal Name</Label><Input placeholder="Emergency Fund" value={goalName} onChange={(e) => setGoalName(e.target.value)} className="bg-muted/50 border-border rounded-xl" /></div>
                <div className="space-y-2"><Label>Target Amount (₹)</Label><Input type="number" placeholder="100000" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} className="bg-muted/50 border-border rounded-xl" /></div>
                <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} className="bg-muted/50 border-border rounded-xl" /></div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {colors.map((c) => (
                      <button key={c} onClick={() => setGoalColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${goalColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGoalDialogOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleAddGoal} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="budget-anim text-lg font-semibold text-foreground">Monthly Budgets</h2>
          <div className="grid gap-4">
            {currentBudgets.length === 0 ? (
              <Card className="budget-anim border-border bg-card rounded-2xl">
                <CardContent className="py-8 text-center text-muted-foreground text-sm">No budgets set for this month.</CardContent>
              </Card>
            ) : (
              currentBudgets.map((budget) => {
                const cat = allCategories.find((c) => c.id === budget.category_id);
                const spent = spentByCategory[budget.category_id] || 0;
                const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
                const isOver = progress > 100;
                return (
                  <Card key={budget.id} className="budget-anim border-border bg-card rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat?.color}15` }}>
                            <span className="text-lg">{cat?.icon || '📌'}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{cat?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(spent)} of {formatCurrency(budget.amount)}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${isOver ? 'text-red-400' : progress > 80 ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)}
                        className={`h-2 ${isOver ? '[&>div]:bg-red-500' : progress > 80 ? '[&>div]:bg-orange-500' : '[&>div]:bg-emerald-500'}`} />
                      {isOver && <p className="text-xs text-red-400 mt-2">Exceeded by {formatCurrency(spent - budget.amount)}</p>}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="budget-anim text-lg font-semibold text-foreground">Savings Goals</h2>
          <div className="grid gap-4">
            {goals.length === 0 ? (
              <Card className="budget-anim border-border bg-card rounded-2xl">
                <CardContent className="py-8 text-center text-muted-foreground text-sm">No goals yet. Create your first savings goal!</CardContent>
              </Card>
            ) : (
              goals.map((goal) => {
                const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
                const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                return (
                  <Card key={goal.id} className="budget-anim border-border bg-card rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${goal.color}15` }}>
                            <PiggyBank className="w-5 h-5" style={{ color: goal.color }} />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{goal.name}</p>
                            {daysLeft !== null && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {daysLeft > 0 ? `${daysLeft} days left` : 'Past deadline'}
                              </p>
                            )}
                          </div>
                        </div>
                        <button onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <BudgetRing progress={progress} size={70} strokeWidth={5} color={goal.color} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2 [&>div]:bg-emerald-500" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {[1000, 5000, 10000].map((amt) => (
                          <Button key={amt} variant="outline" size="sm"
                            onClick={() => handleAddToGoal(goal.id, amt)}
                            className="text-xs border-border rounded-lg">+₹{amt.toLocaleString()}</Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
