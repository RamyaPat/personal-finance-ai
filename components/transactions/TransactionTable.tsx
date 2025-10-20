'use client';

import { Transaction } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrashIcon } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { transactionService } from '@/lib/api';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

type TransactionTableProps = {
  transactions: Transaction[];
  onUpdate: () => void;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Salary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Freelance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Investment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    Transportation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    Shopping: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Bills: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    Healthcare: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    Education: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };
  return colors[category] || 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
};

export function TransactionTable({ transactions, onUpdate }: TransactionTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionService.delete(id);
      toast.success('Transaction deleted successfully!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete transaction');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No transactions yet. Add your first transaction to get started!
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="transition-colors hover:bg-muted/50">
              <TableCell>{format(parseISO(transaction.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getCategoryColor(transaction.category)}>
                  {transaction.category}
                </Badge>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                  {transaction.type}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-medium ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <TransactionForm editTransaction={transaction} onSuccess={onUpdate} />
                <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
