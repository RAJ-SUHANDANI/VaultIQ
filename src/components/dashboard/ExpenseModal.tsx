'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { updateExpense } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Expense } from '@/lib/types';
import { toast } from 'sonner';

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  editExpense?: Expense | null;
  onSave: (data: { amount: number; description: string; category_id: string; date: string; notes?: string }) => Promise<void>;
}

export function ExpenseModal({ open, onClose, editExpense, onSave }: ExpenseModalProps) {
  const categories = useStore((s) => s.categories);
  const updateExpenseInStore = useStore((s) => s.updateExpenseInStore);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount.toString());
      setDescription(editExpense.description);
      setCategoryId(editExpense.category_id);
      setNotes(editExpense.notes || '');
    } else {
      setAmount('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setNotes('');
    }
  }, [editExpense, open, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    setSaving(true);

    if (editExpense) {
      const updated = await updateExpense(editExpense.id, {
        amount: numAmount,
        description: description.trim(),
        category_id: categoryId,
        notes: notes.trim(),
      });
      if (updated) {
        updateExpenseInStore(editExpense.id, updated);
        toast.success('Expense updated');
      }
    } else {
      await onSave({
        amount: numAmount,
        description: description.trim(),
        category_id: categoryId,
        date: new Date().toISOString().split('T')[0],
        notes: notes.trim() || undefined,
      });
    }

    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{editExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {editExpense ? 'Update your expense details' : 'Enter the details of your new expense'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" min="0" placeholder="1000"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              className="bg-muted/50 border-border rounded-xl" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="What did you spend on?"
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/50 border-border rounded-xl" required />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
              <SelectTrigger className="bg-muted/50 border-border rounded-xl">
                <SelectValue placeholder="Select category">
                  {(v: any) => {
                    const cat = categories.find((c) => c.id === v);
                    return cat ? (
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Select category</span>
                    );
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="Add a note..." value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-muted/50 border-border rounded-xl resize-none" rows={2} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-border">
              Cancel
            </Button>
            <Button type="submit" disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
              {saving ? 'Saving...' : editExpense ? 'Update' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
