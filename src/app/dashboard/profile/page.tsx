'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';
import { updateProfile } from '@/lib/supabase/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { formatCurrency, getCurrentMonth, getCurrentYear } from '@/lib/utils';
import { User, Mail, Calendar, Wallet, TrendingUp, PiggyBank, Award, Shield, Zap, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile, expenses, budgets, setProfile } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setIncome(profile.monthly_income.toString());
    }
  }, [profile]);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.prof-anim'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
    );
  }, []);

  const currentMonth = getCurrentMonth() + 1;
  const currentYear = getCurrentYear();

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;

  const currentMonthSpent = useMemo(
    () => expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
    }).reduce((s, e) => s + e.amount, 0),
    [expenses, currentMonth, currentYear]
  );

  const incomeAmount = profile?.monthly_income || 0;
  const savingsRate = incomeAmount > 0 ? ((incomeAmount - currentMonthSpent) / incomeAmount) * 100 : 0;

  const stats = [
    { icon: Wallet, label: 'Total Spent', value: totalSpent, prefix: '₹' },
    { icon: TrendingUp, label: 'Avg Transaction', value: avgTransaction, prefix: '₹' },
    { icon: PiggyBank, label: 'Savings Rate', value: savingsRate, suffix: '%', decimals: 1 },
    { icon: Award, label: 'Transactions', value: expenses.length },
  ];

  const handleSave = async () => {
    setSaving(true);
    const numIncome = parseFloat(income);
    if (isNaN(numIncome)) { toast.error('Invalid income'); setSaving(false); return; }
    await updateProfile({ name: name.trim(), monthly_income: numIncome });
    setProfile({ ...profile!, name: name.trim(), monthly_income: numIncome });
    toast.success('Profile updated');
    setSaving(false);
  };

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="prof-anim">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account and financial summary</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="prof-anim border-border bg-card rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-20 h-20 ring-2 ring-emerald-500/20">
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-2xl">
                    {profile?.name?.split(' ').map((n) => n[0]).join('') || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{profile?.name || 'User'}</h2>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Shield className="w-3.5 h-3.5" />Premium Account</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-lg">
                      <Zap className="w-3 h-3 mr-1" />Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="prof-anim border-border bg-card rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-emerald-400" />
                      </div>
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedCounter to={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} decimals={(stat as any).decimals ?? 0} />
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="prof-anim border-border bg-card rounded-2xl">
            <CardHeader><CardTitle className="text-lg text-foreground">Account Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-muted/50 border-border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Monthly Income (₹)</Label>
                  <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="bg-muted/50 border-border rounded-xl" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                <Save className="mr-2 h-4 w-4" />{saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="prof-anim border-border bg-card rounded-2xl">
            <CardHeader><CardTitle className="text-lg text-foreground">Account Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Account Type', value: 'Premium' },
                { label: 'Monthly Income', value: formatCurrency(incomeAmount) },
                { label: 'Current Balance', value: formatCurrency(incomeAmount - currentMonthSpent) },
                { label: 'Budget Categories', value: budgets.length.toString() },
                { label: 'Total Expenses', value: expenses.length.toString() },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                  {i < 4 && <Separator className="bg-border/50" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
