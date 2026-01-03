'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFilters, ExpenseSummary, Category } from '@/types/expense';
import { storageService } from '@/services/storage';
import { generateId, calculateExpenseSummary, getToday } from '@/lib/utils';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filters: ExpenseFilters;
  summary: ExpenseSummary;
  isLoading: boolean;
  addExpense: (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ExpenseFilters = {
  search: '',
  category: 'All',
  dateFrom: '',
  dateTo: '',
};

const defaultSummary: ExpenseSummary = {
  totalSpending: 0,
  monthlySpending: 0,
  averageExpense: 0,
  expenseCount: 0,
  categoryBreakdown: {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  },
  monthlyTrend: [],
  topCategory: null,
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFiltersState] = useState<ExpenseFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storageService.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  // Filter expenses based on current filters
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((expense) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          expense.description.toLowerCase().includes(searchLower) ||
          expense.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== 'All' && expense.category !== filters.category) {
        return false;
      }

      // Date range filters
      if (filters.dateFrom && expense.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && expense.date > filters.dateTo) {
        return false;
      }

      return true;
    });
  }, [expenses, filters]);

  // Calculate summary
  const summary = React.useMemo(() => {
    return calculateExpenseSummary(expenses);
  }, [expenses]);

  const addExpense = useCallback(
    (data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newExpense: Expense = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      const updatedExpenses = storageService.addExpense(newExpense);
      setExpenses(updatedExpenses);
    },
    []
  );

  const updateExpense = useCallback((id: string, data: Partial<Expense>) => {
    const updatedExpenses = storageService.updateExpense(id, data);
    setExpenses(updatedExpenses);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    const updatedExpenses = storageService.deleteExpense(id);
    setExpenses(updatedExpenses);
  }, []);

  const setFilters = useCallback((newFilters: Partial<ExpenseFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        filters,
        summary,
        isLoading,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
