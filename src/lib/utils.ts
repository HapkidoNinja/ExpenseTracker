import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, ExpenseSummary, Category, CATEGORIES } from '@/types/expense';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatMonthYear(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export function getMonthKey(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Total spending
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Monthly spending (current month)
  const monthlyExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });
  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Average expense
  const averageExpense = expenses.length > 0 ? totalSpending / expenses.length : 0;

  // Category breakdown
  const categoryBreakdown: Record<Category, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach((exp) => {
    categoryBreakdown[exp.category] += exp.amount;
  });

  // Top category
  let topCategory: Category | null = null;
  let maxAmount = 0;
  CATEGORIES.forEach((cat) => {
    if (categoryBreakdown[cat] > maxAmount) {
      maxAmount = categoryBreakdown[cat];
      topCategory = cat;
    }
  });

  // Monthly trend (last 6 months)
  const monthlyTrend: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthKey = getMonthKey(date.toISOString());
    const monthExpenses = expenses.filter((exp) => getMonthKey(exp.date) === monthKey);
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    monthlyTrend.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      total,
    });
  }

  return {
    totalSpending,
    monthlySpending,
    averageExpense,
    expenseCount: expenses.length,
    categoryBreakdown,
    monthlyTrend,
    topCategory,
  };
}

export function exportToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((exp) => [
    exp.date,
    exp.category,
    `"${exp.description.replace(/"/g, '""')}"`,
    exp.amount.toFixed(2),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadCSV(expenses: Expense[], filename: string = 'expenses.csv'): void {
  const csv = exportToCSV(expenses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function validateExpenseForm(data: {
  amount: string;
  category: Category;
  description: string;
  date: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  // Amount validation
  const amount = parseFloat(data.amount);
  if (!data.amount || isNaN(amount)) {
    errors.amount = 'Please enter a valid amount';
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  } else if (amount > 1000000) {
    errors.amount = 'Amount seems too large';
  }

  // Description validation
  if (!data.description.trim()) {
    errors.description = 'Please enter a description';
  } else if (data.description.length > 200) {
    errors.description = 'Description is too long (max 200 characters)';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Please select a date';
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      errors.date = 'Date cannot be in the future';
    }
  }

  // Category validation
  if (!CATEGORIES.includes(data.category)) {
    errors.category = 'Please select a valid category';
  }

  return errors;
}
