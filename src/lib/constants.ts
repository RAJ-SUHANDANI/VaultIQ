export interface CategoryDef {
  name: string;
  color: string;
  icon: string;
}

export const CATEGORIES: CategoryDef[] = [
  { name: 'Food', color: '#10B981', icon: '🍽️' },
  { name: 'Shopping', color: '#3B82F6', icon: '🛍️' },
  { name: 'Travel', color: '#F59E0B', icon: '✈️' },
  { name: 'Bills', color: '#EF4444', icon: '📄' },
  { name: 'Entertainment', color: '#8B5CF6', icon: '🎬' },
  { name: 'Health', color: '#EC4899', icon: '💊' },
  { name: 'Education', color: '#14B8A6', icon: '📚' },
  { name: 'Custom', color: '#6B7280', icon: '📌' },
];

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const DEFAULT_USER = {
  name: 'Raj Patel',
  email: 'raj@vaultiq.app',
  currency: '₹',
  monthlyIncome: 85000,
  joinDate: '2025-01-15',
};

export const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;
