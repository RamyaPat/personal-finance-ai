'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Budget } from '@/lib/supabase';
import { budgetService } from '@/lib/api';
import { toast } from 'sonner';

type BudgetFormProps = {
  onSuccess: () => void;
  editBudget?: Budget;
};

const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Other',
];

export function BudgetForm({ onSuccess, editBudget }: BudgetFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    category: string;
    limit_amount: string;
    period: 'monthly' | 'yearly';
  }>({
    category: editBudget?.category || '',
    limit_amount: editBudget?.limit_amount?.toString() || '',
    period: editBudget?.period || 'monthly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editBudget) {
        await budgetService.update(editBudget.id, {
          category: formData.category,
          limit_amount: parseFloat(formData.limit_amount),
          period: formData.period,
        });
        toast.success('Budget updated successfully!');
      } else {
        await budgetService.create({
          category: formData.category,
          limit_amount: parseFloat(formData.limit_amount),
          period: formData.period,
        });
        toast.success('Budget added successfully!');
      }

      setOpen(false);
      setFormData({
        category: '',
        limit_amount: '',
        period: 'monthly',
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editBudget ? (
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        ) : (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editBudget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="limit_amount">Budget Limit</Label>
            <Input
              id="limit_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.limit_amount}
              onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value as 'monthly' | 'yearly' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : editBudget ? 'Update Budget' : 'Add Budget'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
