import { supabase, Transaction, Budget } from './supabase';

export const transactionService = {
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(budget: Omit<Budget, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('budgets')
      .insert([{ ...budget, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, budget: Partial<Budget>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
