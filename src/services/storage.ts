import { Expense } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

export const storageService = {
  getExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as Expense[];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveExpenses(expenses: Expense[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  addExpense(expense: Expense): Expense[] {
    const expenses = this.getExpenses();
    const updatedExpenses = [expense, ...expenses];
    this.saveExpenses(updatedExpenses);
    return updatedExpenses;
  },

  updateExpense(id: string, updates: Partial<Expense>): Expense[] {
    const expenses = this.getExpenses();
    const updatedExpenses = expenses.map((expense) =>
      expense.id === id
        ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
        : expense
    );
    this.saveExpenses(updatedExpenses);
    return updatedExpenses;
  },

  deleteExpense(id: string): Expense[] {
    const expenses = this.getExpenses();
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    this.saveExpenses(updatedExpenses);
    return updatedExpenses;
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
