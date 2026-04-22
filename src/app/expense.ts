export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
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
