'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/lib/utils';

export function SpendingChart() {
  const { summary, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="h-48 bg-gray-100 rounded"></div>
      </Card>
    );
  }

  const maxValue = Math.max(...summary.monthlyTrend.map((m) => m.total), 1);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Trend</h3>

      {summary.monthlyTrend.every((m) => m.total === 0) ? (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <p>Add expenses to see your spending trend</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {summary.monthlyTrend.map((month, index) => {
              const height = maxValue > 0 ? (month.total / maxValue) * 100 : 0;
              const isCurrentMonth = index === summary.monthlyTrend.length - 1;

              return (
                <div
                  key={month.month}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full relative group flex flex-col items-center">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {formatCurrency(month.total)}
                    </div>

                    {/* Bar */}
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrentMonth
                          ? 'bg-indigo-600'
                          : 'bg-indigo-200 hover:bg-indigo-300'
                      }`}
                      style={{
                        height: `${Math.max(height, 4)}%`,
                        minHeight: month.total > 0 ? '8px' : '4px',
                      }}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-xs text-gray-500 mt-1">{month.month}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-600"></div>
              <span className="text-sm text-gray-500">Current month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-200"></div>
              <span className="text-sm text-gray-500">Previous months</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
