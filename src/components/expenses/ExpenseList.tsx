'use client';

import React, { useState } from 'react';
import { ExpenseItem } from './ExpenseItem';
import { ExpenseFilters } from './ExpenseFilters';
import { ExpenseForm } from './ExpenseForm';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useExpenses } from '@/context/ExpenseContext';
import { Expense } from '@/types/expense';
import { formatCurrency, downloadCSV } from '@/lib/utils';

export function ExpenseList() {
  const { filteredExpenses, deleteExpense, isLoading, expenses } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (expense: Expense) => {
    setDeletingExpense(expense);
  };

  const confirmDelete = () => {
    if (deletingExpense) {
      deleteExpense(deletingExpense.id);
      setDeletingExpense(null);
    }
  };

  const handleExport = () => {
    const dataToExport = filteredExpenses.length > 0 ? filteredExpenses : expenses;
    downloadCSV(dataToExport, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <ExpenseFilters />

      {/* Results summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          {filteredExpenses.length === expenses.length ? (
            <>
              Showing all <span className="font-medium text-gray-700">{expenses.length}</span> expenses
            </>
          ) : (
            <>
              Showing <span className="font-medium text-gray-700">{filteredExpenses.length}</span> of{' '}
              <span className="font-medium text-gray-700">{expenses.length}</span> expenses
            </>
          )}
          {filteredExpenses.length > 0 && (
            <span className="ml-2 text-gray-400">
              • Total: <span className="font-medium text-gray-700">{formatCurrency(totalFiltered)}</span>
            </span>
          )}
        </p>

        {expenses.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </Button>
        )}
      </div>

      {/* Expense list */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
          <p className="text-gray-500">
            {expenses.length === 0
              ? 'Start tracking your spending by adding your first expense.'
              : 'Try adjusting your filters to find what you\'re looking for.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            expense={editingExpense}
            onClose={() => setEditingExpense(null)}
            isModal
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deletingExpense?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
