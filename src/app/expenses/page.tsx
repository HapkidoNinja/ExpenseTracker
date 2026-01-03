'use client';

import { ExpenseList } from '@/components/expenses/ExpenseList';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">
            View, filter, and manage all your expenses
          </p>
        </div>
        <Link href="/add">
          <Button>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Expense List */}
      <ExpenseList />
    </div>
  );
}
