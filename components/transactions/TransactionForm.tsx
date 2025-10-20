'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Transaction } from '@/lib/supabase';
import { transactionService } from '@/lib/api';
import { toast } from 'sonner';

type TransactionFormProps = {
  onSuccess: () => void;
  editTransaction?: Transaction;
};

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
];

export function TransactionForm({ onSuccess, editTransaction }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    date: string;
    category: string;
    description: string;
    amount: string;
    type: 'income' | 'expense';
  }>({
    date: editTransaction?.date || new Date().toISOString().split('T')[0],
    category: editTransaction?.category || '',
    description: editTransaction?.description || '',
    amount: editTransaction?.amount?.toString() || '',
    type: editTransaction?.type || 'expense',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editTransaction) {
        await transactionService.update(editTransaction.id, {
          date: formData.date,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          type: formData.type,
        });
        toast.success('Transaction updated successfully!');
      } else {
        await transactionService.create({
          date: formData.date,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          type: formData.type,
        });
        toast.success('Transaction added successfully!');
      }

      setOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        amount: '',
        type: 'expense',
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editTransaction ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : editTransaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
