'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { useStore } from '@/lib/store';
import { deleteExpense as deleteExpenseQuery } from '@/lib/supabase/queries';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, ArrowUpDown, Trash2, Edit3, Filter } from 'lucide-react';
import { ExpenseModal } from '@/components/dashboard/ExpenseModal';
import { createExpense, updateExpense as updateExpenseQuery } from '@/lib/supabase/queries';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const { expenses, categories, profile, removeExpense, addExpense, updateExpenseInStore } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [editExpense, setEditExpense] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const perPage = 15;

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('.tx-anim'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => { setPage(0); }, [search, categoryFilter]);

  const filtered = useMemo(() => {
    let result = [...expenses];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((e) =>
        e.description.toLowerCase().includes(q) ||
        categories.find((c) => c.id === e.category_id)?.name.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter((e) => e.category_id === categoryFilter);
    }
    result.sort((a, b) => {
      if (sortField === 'date') {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortDir === 'desc' ? diff : -diff;
      }
      return sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    });
    return result;
  }, [expenses, search, categoryFilter, sortField, sortDir, categories]);

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleEdit = (expense: any) => { setEditExpense(expense); setModalOpen(true); };

  const handleDelete = async (id: string) => {
    await deleteExpenseQuery(id);
    removeExpense(id);
    toast.success('Transaction deleted');
  };

  const handleSave = async (data: any) => {
    if (editExpense) {
      const updated = await updateExpenseQuery(editExpense.id, data);
      if (updated) { updateExpenseInStore(editExpense.id, updated); toast.success('Expense updated'); }
    } else {
      const created = await createExpense(data);
      if (created) { addExpense(created); toast.success('Expense added'); }
    }
    setModalOpen(false);
    setEditExpense(null);
  };

  const getCat = (id: string) => categories.find((c) => c.id === id);

  return (
    <div ref={sectionRef} className="space-y-6">
      <div className="tx-anim">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted-foreground">View and manage all your expenses</p>
      </div>

      <div className="tx-anim flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/50 border-border rounded-xl" />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-muted/50 border-border rounded-xl">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Categories">
              {(v: any) => {
                if (!v || v === 'all') return <span>All Categories</span>;
                const cat = categories.find((c) => c.id === v);
                return cat ? (
                  <span className="flex items-center gap-2"><span>{cat.icon}</span><span>{cat.name}</span></span>
                ) : <span>All Categories</span>;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="flex items-center gap-2"><span>{cat.icon}</span><span>{cat.name}</span></span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="tx-anim border border-border rounded-2xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground">Category</TableHead>
              <TableHead className="text-muted-foreground cursor-pointer" onClick={() => toggleSort('date')}>
                <span className="flex items-center gap-1">Date <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="text-muted-foreground text-right cursor-pointer" onClick={() => toggleSort('amount')}>
                <span className="flex items-center justify-end gap-1">Amount <ArrowUpDown className="h-3 w-3" /></span>
              </TableHead>
              <TableHead className="text-muted-foreground w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No transactions found</TableCell></TableRow>
            ) : (
              paginated.map((expense) => {
                const cat = getCat(expense.category_id);
                return (
                  <TableRow key={expense.id} className="border-border hover:bg-muted/30">
                    <TableCell>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      {expense.notes && <p className="text-xs text-muted-foreground">{expense.notes}</p>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-0 rounded-lg"
                        style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}>
                        {cat?.icon} {cat?.name || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(expense.date)}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{formatCurrency(expense.amount, profile?.currency || '₹')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(expense)}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(expense.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30">
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg text-sm transition-colors ${page === i ? 'bg-emerald-500/10 text-emerald-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30">
            Next
          </button>
        </div>
      )}

      <ExpenseModal open={modalOpen} onClose={() => { setModalOpen(false); setEditExpense(null); }}
        editExpense={editExpense} onSave={handleSave} />
    </div>
  );
}
