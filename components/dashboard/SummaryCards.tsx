'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, WalletIcon } from 'lucide-react';
import { Transaction } from '@/lib/supabase';

type SummaryCardsProps = {
  transactions: Transaction[];
};

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">All time earnings</p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">All time spending</p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <WalletIcon className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground">Current balance</p>
        </CardContent>
      </Card>
    </div>
  );
}
