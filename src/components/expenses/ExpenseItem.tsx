'use client';

import React, { useState } from 'react';
import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryColor = CATEGORY_COLORS[expense.category];
  const categoryIcon = CATEGORY_ICONS[expense.category];

  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100',
        'hover:border-gray-200 hover:shadow-sm transition-all duration-200'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ backgroundColor: `${categoryColor}15` }}
      >
        {categoryIcon}
      </div>

      {/* Description and Category */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{expense.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {expense.category}
          </span>
          <span className="text-sm text-gray-400">{formatDate(expense.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="font-semibold text-gray-900 text-lg">
          {formatCurrency(expense.amount)}
        </p>
      </div>

      {/* Actions */}
      <div
        className={cn(
          'flex items-center gap-1 shrink-0 transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      >
        <button
          onClick={() => onEdit(expense)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit expense"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(expense)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete expense"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
