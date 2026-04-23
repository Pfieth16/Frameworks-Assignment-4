export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  userId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId?: string;
}

export interface Budget {
  id: string;
  amount: number;
  userId: string;
}

export const BOOTSTRAP_BADGE_COLORS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
];
