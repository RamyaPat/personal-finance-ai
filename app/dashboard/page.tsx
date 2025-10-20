'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { transactionService, budgetService } from '@/lib/api';
import { Transaction, Budget } from '@/lib/supabase';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { BudgetList } from '@/components/budgets/BudgetList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOutIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [transactionsData, budgetsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Finance Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            <SummaryCards transactions={transactions} />

            <div className="grid gap-6 md:grid-cols-2">
              <ExpenseChart transactions={transactions} />
              <BalanceChart transactions={transactions} />
            </div>

            <Tabs defaultValue="transactions" className="space-y-4">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budgets">Budgets</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Recent Transactions</CardTitle>
                    <TransactionForm onSuccess={fetchData} />
                  </CardHeader>
                  <CardContent>
                    <TransactionTable transactions={transactions} onUpdate={fetchData} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="budgets">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Budget Overview</CardTitle>
                    <BudgetForm onSuccess={fetchData} />
                  </CardHeader>
                  <CardContent>
                    <BudgetList budgets={budgets} transactions={transactions} onUpdate={fetchData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
