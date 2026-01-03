'use client';

import React, { useState, useEffect } from 'react';
import { SummaryCards } from './SummaryCards';
import { SpendingChart } from './SpendingChart';
import { CategoryBreakdown } from './CategoryBreakdown';
import { ExportHub } from '@/components/export/ExportHub';
import { useExpenses } from '@/context/ExpenseContext';
import { cloudExportService } from '@/services/cloudExport';

export function Dashboard() {
  const [isExportHubOpen, setIsExportHubOpen] = useState(false);
  const [connectedCount, setConnectedCount] = useState(0);
  const { expenses } = useExpenses();

  useEffect(() => {
    const integrations = cloudExportService.getIntegrations();
    setConnectedCount(integrations.filter((i) => i.connected).length);
  }, [isExportHubOpen]);

  return (
    <div className="space-y-6">
      {/* Cloud Export Action Bar */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsExportHubOpen(true)}
          disabled={expenses.length === 0}
          className="group relative inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Animated cloud icon */}
          <div className="relative">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {/* Sync indicator */}
            {connectedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>

          <span>Export Hub</span>

          {/* Integration badge */}
          {connectedCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">
              {connectedCount} connected
            </span>
          )}

          {/* Hover effect ring */}
          <span className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
        </button>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <CategoryBreakdown />
      </div>

      {/* Export Hub Modal */}
      <ExportHub
        isOpen={isExportHubOpen}
        onClose={() => setIsExportHubOpen(false)}
      />
    </div>
  );
}
