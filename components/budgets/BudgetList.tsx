'use client';

import { Budget, Transaction } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { BudgetForm } from './BudgetForm';
import { budgetService } from '@/lib/api';
import { toast } from 'sonner';

type BudgetListProps = {
  budgets: Budget[];
  transactions: Transaction[];
  onUpdate: () => void;
};

export function BudgetList({ budgets, transactions, onUpdate }: BudgetListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      await budgetService.delete(id);
      toast.success('Budget deleted successfully!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete budget');
    }
  };

  const calculateSpent = (category: string, period: string) => {
    const now = new Date();
    const relevantTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      if (period === 'monthly') {
        return (
          t.category === category &&
          t.type === 'expense' &&
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear()
        );
      } else {
        return (
          t.category === category &&
          t.type === 'expense' &&
          transactionDate.getFullYear() === now.getFullYear()
        );
      }
    });

    return relevantTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (budgets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No budgets set. Add a budget to track your spending!
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => {
        const spent = calculateSpent(budget.category, budget.period);
        const limit = Number(budget.limit_amount);
        const percentage = (spent / limit) * 100;
        const isOverBudget = spent > limit;

        return (
          <Card key={budget.id} className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{budget.category}</CardTitle>
              <div className="flex gap-2">
                <BudgetForm editBudget={budget} onSuccess={onUpdate} />
                <Button variant="ghost" size="sm" onClick={() => handleDelete(budget.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                    {formatCurrency(spent)} spent
                  </span>
                  <span className="text-muted-foreground">of {formatCurrency(limit)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{budget.period}</span>
                  <span className={isOverBudget ? 'text-red-600 font-medium' : ''}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                {isOverBudget && (
                  <p className="text-xs text-red-600 font-medium">Over budget by {formatCurrency(spent - limit)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
