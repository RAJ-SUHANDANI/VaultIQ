'use client';

import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { TrendingUp, DollarSign, PieChart as PieIcon, Wallet } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6B7280'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: ₹{p.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { expenses, categories, profile } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.chart-anim'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = MONTHS[d.getMonth()];
      map[key] = (map[key] || 0) + e.amount;
    });
    return MONTHS.map((m) => ({ month: m, expenses: map[m] || 0 }));
  }, [expenses]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category_id] = (map[e.category_id] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([id, value]) => {
        const cat = categories.find((c) => c.id === id);
        return { name: cat?.name || 'Unknown', value, color: cat?.color || '#6B7280', icon: cat?.icon || '📌' };
      })
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const monthCount = Math.max(1, new Set(expenses.map((e) => `${new Date(e.date).getMonth()}-${new Date(e.date).getFullYear()}`)).size);
  const avgMonthly = totalExpenses / monthCount;
  const income = profile?.monthly_income || 0;
  const savingsRate = income > 0 ? ((income - avgMonthly) / income) * 100 : 0;

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="chart-anim">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep insights into your financial habits</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="chart-anim border-border bg-card rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-400" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-xl font-bold text-foreground"><AnimatedCounter to={totalExpenses} prefix="₹" duration={1.5} /></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="chart-anim border-border bg-card rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Avg</p>
                <p className="text-xl font-bold text-foreground"><AnimatedCounter to={avgMonthly} prefix="₹" duration={1.5} /></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="chart-anim border-border bg-card rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><PieIcon className="w-5 h-5 text-purple-400" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-xl font-bold text-foreground">{categoryData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="chart-anim border-border bg-card rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><Wallet className="w-5 h-5 text-orange-400" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p className="text-xl font-bold text-foreground"><AnimatedCounter to={savingsRate} suffix="%" decimals={1} duration={1.5} /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="chart-anim">
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg">Categories</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-lg">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="border-border bg-card rounded-2xl">
            <CardHeader><CardTitle className="text-lg text-foreground">Monthly Spending</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="expenses" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-card rounded-2xl">
              <CardHeader><CardTitle className="text-lg text-foreground">Category Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                        {categoryData.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card rounded-2xl">
              <CardHeader><CardTitle className="text-lg text-foreground">By Category</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-foreground">{cat.icon} {cat.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₹{cat.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {categoryData.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card className="border-border bg-card rounded-2xl">
            <CardHeader><CardTitle className="text-lg text-foreground">Spending Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="expenses" stroke="#10B981" fill="url(#expGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
