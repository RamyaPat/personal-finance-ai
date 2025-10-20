'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

type BalanceChartProps = {
  transactions: Transaction[];
};

export function BalanceChart({ transactions }: BalanceChartProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningBalance = 0;
  const balanceData = sortedTransactions.map((transaction) => {
    if (transaction.type === 'income') {
      runningBalance += Number(transaction.amount);
    } else {
      runningBalance -= Number(transaction.amount);
    }

    return {
      date: format(parseISO(transaction.date), 'MMM dd'),
      balance: runningBalance,
    };
  });

  if (balanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance Over Time</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No transaction data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={balanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
