'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useExpenses } from '@/context/ExpenseContext';
import { cn, formatDate } from '@/lib/utils';
import {
  cloudExportService,
  CloudIntegration,
  ExportTemplate,
  ExportHistoryItem,
  ScheduledExport,
  ShareableExport,
  IntegrationType,
  ExportTemplateType,
  ScheduleFrequency,
  INTEGRATIONS,
  EXPORT_TEMPLATES,
} from '@/services/cloudExport';

interface ExportHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'integrations' | 'templates' | 'history' | 'schedule' | 'share';

export function ExportHub({ isOpen, onClose }: ExportHubProps) {
  const { expenses } = useExpenses();
  const [activeTab, setActiveTab] = useState<TabType>('integrations');
  const [integrations, setIntegrations] = useState<CloudIntegration[]>([]);
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduledExport[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load data on mount
  useEffect(() => {
    if (isOpen) {
      setIntegrations(cloudExportService.getIntegrations());
      setHistory(cloudExportService.getExportHistory());
      setSchedules(cloudExportService.getScheduledExports());
    }
  }, [isOpen]);

  // Show notification
  const showNotification = useCallback(
    (type: 'success' | 'error', message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    },
    []
  );

  // Handle integration toggle
  const handleToggleIntegration = async (id: IntegrationType) => {
    setConnectingId(id);
    const connected = await cloudExportService.toggleIntegration(id);
    setIntegrations(cloudExportService.getIntegrations());
    setConnectingId(null);

    const integration = INTEGRATIONS.find((i) => i.id === id);
    showNotification(
      'success',
      connected
        ? `Connected to ${integration?.name}`
        : `Disconnected from ${integration?.name}`
    );
  };

  // Handle export to cloud
  const handleExportToCloud = async (
    template: ExportTemplateType,
    destination: IntegrationType
  ) => {
    setIsProcessing(true);
    const result = await cloudExportService.exportToCloud(expenses, template, destination);
    setHistory(cloudExportService.getExportHistory());
    setIsProcessing(false);

    if (result.status === 'completed') {
      showNotification('success', `Exported ${result.recordCount} records successfully!`);
    } else {
      showNotification('error', result.error || 'Export failed');
    }
  };

  // Handle schedule creation
  const handleCreateSchedule = (
    template: ExportTemplateType,
    destination: IntegrationType,
    frequency: ScheduleFrequency
  ) => {
    cloudExportService.createSchedule(template, destination, frequency);
    setSchedules(cloudExportService.getScheduledExports());
    showNotification('success', 'Scheduled export created!');
  };

  // Handle schedule toggle
  const handleToggleSchedule = (id: string) => {
    cloudExportService.toggleSchedule(id);
    setSchedules(cloudExportService.getScheduledExports());
  };

  // Handle schedule delete
  const handleDeleteSchedule = (id: string) => {
    cloudExportService.deleteSchedule(id);
    setSchedules(cloudExportService.getScheduledExports());
    showNotification('success', 'Schedule deleted');
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'schedule', label: 'Schedule', icon: '⏰' },
    { id: 'share', label: 'Share', icon: '🔗' },
  ];

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Hub</h2>
            <p className="text-sm text-gray-500">
              Cloud-connected export with {connectedCount} active integrations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Cloud Sync Active
            </span>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={cn(
              'mb-4 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in',
              notification.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            )}
          >
            <span>{notification.type === 'success' ? '✓' : '✕'}</span>
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[350px]">
          {activeTab === 'integrations' && (
            <IntegrationsPanel
              integrations={integrations}
              connectingId={connectingId}
              onToggle={handleToggleIntegration}
            />
          )}
          {activeTab === 'templates' && (
            <TemplatesPanel
              integrations={integrations}
              isProcessing={isProcessing}
              onExport={handleExportToCloud}
              expenseCount={expenses.length}
            />
          )}
          {activeTab === 'history' && (
            <HistoryPanel
              history={history}
              onClear={() => {
                cloudExportService.clearHistory();
                setHistory([]);
                showNotification('success', 'History cleared');
              }}
            />
          )}
          {activeTab === 'schedule' && (
            <SchedulePanel
              schedules={schedules}
              integrations={integrations}
              onToggle={handleToggleSchedule}
              onDelete={handleDeleteSchedule}
              onCreate={handleCreateSchedule}
            />
          )}
          {activeTab === 'share' && (
            <SharePanel
              expenses={expenses}
              onShare={(link) => showNotification('success', 'Share link created!')}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {expenses.length} expenses available for export
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// Integrations Panel
// ============================================================================

function IntegrationsPanel({
  integrations,
  connectingId,
  onToggle,
}: {
  integrations: CloudIntegration[];
  connectingId: string | null;
  onToggle: (id: IntegrationType) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integrations.map((integration) => (
        <div
          key={integration.id}
          className={cn(
            'p-4 rounded-xl border-2 transition-all',
            integration.connected
              ? 'border-green-200 bg-green-50/50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                {integration.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                <p className="text-xs text-gray-500">{integration.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            {integration.connected ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Connected
              </span>
            ) : (
              <span className="text-xs text-gray-400">Not connected</span>
            )}
            <Button
              size="sm"
              variant={integration.connected ? 'ghost' : 'primary'}
              onClick={() => onToggle(integration.id)}
              isLoading={connectingId === integration.id}
            >
              {integration.connected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Templates Panel
// ============================================================================

function TemplatesPanel({
  integrations,
  isProcessing,
  onExport,
  expenseCount,
}: {
  integrations: CloudIntegration[];
  isProcessing: boolean;
  onExport: (template: ExportTemplateType, destination: IntegrationType) => void;
  expenseCount: number;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplateType | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<IntegrationType | null>(null);

  const connectedIntegrations = integrations.filter((i) => i.connected);

  const handleExport = () => {
    if (selectedTemplate && selectedDestination) {
      onExport(selectedTemplate, selectedDestination);
      setSelectedTemplate(null);
      setSelectedDestination(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Choose a template</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPORT_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all',
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <h5 className="font-semibold text-gray-900 text-sm">{template.name}</h5>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Destination Selection */}
      {selectedTemplate && (
        <div className="animate-fade-in">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Export to</h4>
          {connectedIntegrations.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              No integrations connected. Go to the Integrations tab to connect services.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {connectedIntegrations.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => setSelectedDestination(integration.id)}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                    selectedDestination === integration.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <span>{integration.icon}</span>
                  <span className="text-sm font-medium">{integration.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export Button */}
      {selectedTemplate && selectedDestination && (
        <div className="flex justify-end animate-fade-in">
          <Button onClick={handleExport} isLoading={isProcessing} disabled={expenseCount === 0}>
            <svg
              className="w-4 h-4 mr-2"
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
            Export {expenseCount} Records
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// History Panel
// ============================================================================

function HistoryPanel({
  history,
  onClear,
}: {
  history: ExportHistoryItem[];
  onClear: () => void;
}) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <span className="text-4xl mb-3">📭</span>
        <p>No export history yet</p>
        <p className="text-sm">Your exports will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Recent Exports</h4>
        <button onClick={onClear} className="text-xs text-red-600 hover:text-red-700">
          Clear History
        </button>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {history.map((item) => {
          const template = EXPORT_TEMPLATES.find((t) => t.id === item.template);
          const destination = INTEGRATIONS.find((i) => i.id === item.destination);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{template?.icon || '📄'}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      {template?.name || 'Export'}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm text-gray-600">
                      {destination?.name || item.destination}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(item.timestamp)} • {item.recordCount} records
                    {item.fileSize && ` • ${item.fileSize}`}
                  </div>
                </div>
              </div>
              <div>
                {item.status === 'completed' && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    ✓ Done
                  </span>
                )}
                {item.status === 'failed' && (
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    ✕ Failed
                  </span>
                )}
                {item.status === 'processing' && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    ⟳ Processing
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Schedule Panel
// ============================================================================

function SchedulePanel({
  schedules,
  integrations,
  onToggle,
  onDelete,
  onCreate,
}: {
  schedules: ScheduledExport[];
  integrations: CloudIntegration[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (
    template: ExportTemplateType,
    destination: IntegrationType,
    frequency: ScheduleFrequency
  ) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<ExportTemplateType>('monthly-summary');
  const [newDestination, setNewDestination] = useState<IntegrationType>('email');
  const [newFrequency, setNewFrequency] = useState<ScheduleFrequency>('weekly');

  const connectedIntegrations = integrations.filter((i) => i.connected);

  const handleCreate = () => {
    onCreate(newTemplate, newDestination, newFrequency);
    setShowCreate(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-gray-700">Scheduled Exports</h4>
        <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : '+ New Schedule'}
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="p-4 bg-indigo-50 rounded-xl space-y-4 animate-fade-in">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Template</label>
              <select
                value={newTemplate}
                onChange={(e) => setNewTemplate(e.target.value as ExportTemplateType)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                {EXPORT_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Destination</label>
              <select
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value as IntegrationType)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                {connectedIntegrations.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.icon} {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as ScheduleFrequency)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleCreate}>
              Create Schedule
            </Button>
          </div>
        </div>
      )}

      {/* Schedules List */}
      {schedules.length === 0 && !showCreate ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <span className="text-4xl mb-3">⏰</span>
          <p>No scheduled exports</p>
          <p className="text-sm">Automate your exports with schedules</p>
        </div>
      ) : (
        <div className="space-y-2">
          {schedules.map((schedule) => {
            const template = EXPORT_TEMPLATES.find((t) => t.id === schedule.template);
            const destination = INTEGRATIONS.find((i) => i.id === schedule.destination);

            return (
              <div
                key={schedule.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border',
                  schedule.enabled
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{template?.icon || '📄'}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-900">
                        {template?.name}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm text-gray-600">{destination?.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                      {' • Next: '}
                      {formatDate(schedule.nextRun)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggle(schedule.id)}
                    className={cn(
                      'w-10 h-6 rounded-full transition-colors relative',
                      schedule.enabled ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        schedule.enabled ? 'left-5' : 'left-1'
                      )}
                    />
                  </button>
                  <button
                    onClick={() => onDelete(schedule.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Share Panel
// ============================================================================

function SharePanel({
  expenses,
  onShare,
}: {
  expenses: { id: string }[];
  onShare: (link: string) => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [shareResult, setShareResult] = useState<ShareableExport | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplateType>('full-export');
  const [expiresIn, setExpiresIn] = useState(7);
  const [maxAccess, setMaxAccess] = useState(10);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreateShare = async () => {
    setIsCreating(true);
    const result = await cloudExportService.createShareableLink(
      expenses as any,
      selectedTemplate,
      { expiresIn, maxAccess, password: password || undefined }
    );
    setShareResult(result);
    setIsCreating(false);
    onShare(result.link);
  };

  const handleCopy = () => {
    if (shareResult) {
      navigator.clipboard.writeText(shareResult.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setShareResult(null);
    setPassword('');
  };

  if (shareResult) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <span className="text-3xl">🔗</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Share Link Created!</h4>
          <p className="text-sm text-gray-500 mt-1">
            Expires in {expiresIn} days • {maxAccess} max views
          </p>
        </div>

        {/* Link */}
        <div className="flex gap-2">
          <input
            type="text"
            value={shareResult.link}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm"
          />
          <Button onClick={handleCopy} variant={copied ? 'primary' : 'secondary'}>
            {copied ? '✓ Copied!' : 'Copy'}
          </Button>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <img
              src={shareResult.qrCode}
              alt="QR Code"
              className="w-32 h-32"
            />
            <p className="text-xs text-center text-gray-400 mt-2">Scan to access</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={handleReset}>
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Create Shareable Link</h4>
        <p className="text-sm text-gray-500 mb-4">
          Generate a secure link to share your expense data with others
        </p>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Export Template</label>
        <div className="flex flex-wrap gap-2">
          {EXPORT_TEMPLATES.slice(0, 3).map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm transition-all',
                selectedTemplate === template.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <span>{template.icon}</span>
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Expires In</label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Max Views</label>
          <select
            value={maxAccess}
            onChange={(e) => setMaxAccess(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
          >
            <option value={1}>1 view</option>
            <option value={5}>5 views</option>
            <option value={10}>10 views</option>
            <option value={100}>100 views</option>
            <option value={-1}>Unlimited</option>
          </select>
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Password Protection (optional)
        </label>
        <Input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreateShare} isLoading={isCreating} disabled={expenses.length === 0}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Generate Share Link
        </Button>
      </div>
    </div>
  );
}
