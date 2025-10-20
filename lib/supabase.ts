import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Transaction = {
  id: string;
  user_id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  limit_amount: number;
  period: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
};
