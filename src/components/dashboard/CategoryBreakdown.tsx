'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency } from '@/lib/utils';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS, Category } from '@/types/expense';

export function CategoryBreakdown() {
  const { summary, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  const totalSpending = summary.totalSpending;
  const hasData = totalSpending > 0;

  // Sort categories by spending amount (descending)
  const sortedCategories = [...CATEGORIES].sort(
    (a, b) => summary.categoryBreakdown[b] - summary.categoryBreakdown[a]
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center text-gray-400">
          <p>Add expenses to see category breakdown</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCategories.map((category) => {
            const amount = summary.categoryBreakdown[category];
            const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
            const color = CATEGORY_COLORS[category];
            const icon = CATEGORY_ICONS[category];

            return (
              <div key={category} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm font-semibold text-gray-900 min-w-[80px] text-right">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pie chart visual */}
      {hasData && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  let currentAngle = 0;

                  return sortedCategories
                    .filter((cat) => summary.categoryBreakdown[cat] > 0)
                    .map((category) => {
                      const percentage =
                        (summary.categoryBreakdown[category] / totalSpending) * 100;
                      const angle = (percentage / 100) * 360;
                      const startAngle = currentAngle;
                      currentAngle += angle;

                      // Calculate arc path
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = ((startAngle + angle) * Math.PI) / 180;

                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);

                      const largeArc = angle > 180 ? 1 : 0;

                      const path =
                        angle >= 360
                          ? `M 50 10 A 40 40 0 1 1 49.99 10`
                          : `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

                      return (
                        <path
                          key={category}
                          d={path}
                          fill={CATEGORY_COLORS[category]}
                          className="hover:opacity-80 transition-opacity"
                        />
                      );
                    });
                })()}
              </svg>
              {/* Center circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500 font-medium text-center">
                    {CATEGORIES.filter((c) => summary.categoryBreakdown[c] > 0).length}
                    <br />
                    categories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
