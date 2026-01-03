'use client';

import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import Link from 'next/link';

export default function AddExpensePage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li className="text-gray-900 font-medium">Add Expense</li>
        </ol>
      </nav>

      {/* Form Card */}
      <ExpenseForm />

      {/* Tips */}
      <div className="mt-8 p-4 bg-indigo-50 rounded-xl">
        <h4 className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tips for tracking expenses
        </h4>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Add expenses as soon as you make them to avoid forgetting</li>
          <li>• Use clear descriptions to easily find expenses later</li>
          <li>• Choose the right category for better spending insights</li>
          <li>• Review your dashboard regularly to track your habits</li>
        </ul>
      </div>
    </div>
  );
}
