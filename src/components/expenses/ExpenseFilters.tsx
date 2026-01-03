'use client';

import React from 'react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, Category } from '@/types/expense';
import { useExpenses } from '@/context/ExpenseContext';

export function ExpenseFilters() {
  const { filters, setFilters, resetFilters } = useExpenses();

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ];

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'All' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            icon={
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Category filter */}
        <div className="w-full lg:w-48">
          <Select
            value={filters.category}
            onChange={(e) =>
              setFilters({ category: e.target.value as Category | 'All' })
            }
            options={categoryOptions}
          />
        </div>

        {/* Date range */}
        <div className="flex gap-2 items-center">
          <Input
            type="date"
            placeholder="From"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ dateFrom: e.target.value })}
            className="w-36"
          />
          <span className="text-gray-400">to</span>
          <Input
            type="date"
            placeholder="To"
            value={filters.dateTo}
            onChange={(e) => setFilters({ dateTo: e.target.value })}
            className="w-36"
          />
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={resetFilters} className="shrink-0">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
