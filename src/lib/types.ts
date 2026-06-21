export interface Profile {
  id: string;
  name: string;
  currency: string;
  monthly_income: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category_id: string;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, 'name' | 'icon' | 'color'>;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, 'name' | 'icon' | 'color'>;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonthlyAnalytics {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryAnalytics {
  name: string;
  value: number;
  color: string;
  icon: string;
}
