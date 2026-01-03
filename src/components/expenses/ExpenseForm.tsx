'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Expense, Category, CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import { validateExpenseForm, getToday } from '@/lib/utils';
import { useExpenses } from '@/context/ExpenseContext';

interface ExpenseFormProps {
  expense?: Expense;
  onClose?: () => void;
  isModal?: boolean;
}

export function ExpenseForm({ expense, onClose, isModal = false }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();
  const isEditing = !!expense;

  const [formData, setFormData] = useState({
    amount: expense?.amount.toString() || '',
    category: expense?.category || ('Food' as Category),
    description: expense?.description || '',
    date: expense?.date || getToday(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateExpenseForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      };

      if (isEditing && expense) {
        updateExpense(expense.id, expenseData);
      } else {
        addExpense(expenseData);
      }

      // Show success state
      setShowSuccess(true);

      if (!isEditing) {
        // Reset form for new expense
        setFormData({
          amount: '',
          category: 'Food',
          description: '',
          date: getToday(),
        });
      }

      // Hide success after delay
      setTimeout(() => {
        setShowSuccess(false);
        if (onClose) {
          onClose();
        }
      }, 1500);
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: `${CATEGORY_ICONS[cat]} ${cat}`,
  }));

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          icon={
            <span className="text-gray-500 font-medium">$</span>
          }
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          max={getToday()}
        />
      </div>

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categoryOptions}
        error={errors.category}
      />

      <Input
        label="Description"
        name="description"
        type="text"
        placeholder="What was this expense for?"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        maxLength={200}
      />

      <div className="flex items-center justify-end gap-3 pt-2">
        {isModal && onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className={showSuccess ? 'bg-green-600 hover:bg-green-600' : ''}
        >
          {showSuccess ? (
            <>
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isEditing ? 'Updated!' : 'Added!'}
            </>
          ) : isEditing ? (
            'Update Expense'
          ) : (
            'Add Expense'
          )}
        </Button>
      </div>
    </form>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <Card className="w-full">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? 'Update the details of your expense'
            : 'Track your spending by adding a new expense'}
        </p>
      </div>
      {formContent}
    </Card>
  );
}
