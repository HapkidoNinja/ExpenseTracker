export type Category =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#22c55e',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#f59e0b',
  Bills: '#ef4444',
  Other: '#6b7280',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📦',
};

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ExpenseFormData {
  amount: string;
  category: Category;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  search: string;
  category: Category | 'All';
  dateFrom: string;
  dateTo: string;
}

export interface ExpenseSummary {
  totalSpending: number;
  monthlySpending: number;
  averageExpense: number;
  expenseCount: number;
  categoryBreakdown: Record<Category, number>;
  monthlyTrend: { month: string; total: number }[];
  topCategory: Category | null;
}
