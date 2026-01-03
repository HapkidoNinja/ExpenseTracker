'use client';

import { Dashboard } from '@/components/dashboard/Dashboard';
import { useExpenses } from '@/context/ExpenseContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { expenses, isLoading } = useExpenses();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Track your spending and manage your expenses
          </p>
        </div>
        <Link href="/add">
          <Button size="lg">
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

      {/* Dashboard Content */}
      <Dashboard />

      {/* Quick Actions / Empty State */}
      {!isLoading && expenses.length === 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Start Tracking Your Expenses
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by adding your first expense. Track your spending across
            different categories and gain insights into your financial habits.
          </p>
          <Link href="/add">
            <Button size="lg">
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
              Add Your First Expense
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Expenses Preview */}
      {!isLoading && expenses.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <Link
              href="/expenses"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {expense.category === 'Food' && '🍔'}
                    {expense.category === 'Transportation' && '🚗'}
                    {expense.category === 'Entertainment' && '🎬'}
                    {expense.category === 'Shopping' && '🛍️'}
                    {expense.category === 'Bills' && '📄'}
                    {expense.category === 'Other' && '📦'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {expense.description}
                    </p>
                    <p className="text-xs text-gray-400">{expense.category}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  ${expense.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
