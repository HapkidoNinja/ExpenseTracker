import { Expense, Category, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

export type IntegrationType =
  | 'google-sheets'
  | 'dropbox'
  | 'onedrive'
  | 'email'
  | 'notion'
  | 'airtable';

export type ExportTemplateType =
  | 'full-export'
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'weekly-digest';

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly';

export interface CloudIntegration {
  id: IntegrationType;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: string;
  description: string;
}

export interface ExportTemplate {
  id: ExportTemplateType;
  name: string;
  description: string;
  icon: string;
  fields: string[];
  filters?: {
    dateRange?: 'last-week' | 'last-month' | 'last-quarter' | 'last-year' | 'all';
    categories?: Category[];
  };
}

export interface ExportHistoryItem {
  id: string;
  timestamp: string;
  template: ExportTemplateType;
  destination: IntegrationType | 'download' | 'share-link';
  status: ExportStatus;
  recordCount: number;
  fileSize?: string;
  shareLink?: string;
  error?: string;
}

export interface ScheduledExport {
  id: string;
  template: ExportTemplateType;
  destination: IntegrationType;
  frequency: ScheduleFrequency;
  nextRun: string;
  enabled: boolean;
  createdAt: string;
}

export interface ShareableExport {
  id: string;
  link: string;
  qrCode: string;
  expiresAt: string;
  accessCount: number;
  maxAccess: number;
  password?: string;
}

// ============================================================================
// Constants
// ============================================================================

export const INTEGRATIONS: CloudIntegration[] = [
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: '📊',
    color: '#34A853',
    connected: false,
    description: 'Sync expenses to a Google Spreadsheet automatically',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    color: '#0061FF',
    connected: false,
    description: 'Save exports to your Dropbox cloud storage',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    color: '#0078D4',
    connected: false,
    description: 'Backup to Microsoft OneDrive',
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    color: '#EA4335',
    connected: true, // Always available
    description: 'Send exports directly to your inbox',
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📝',
    color: '#000000',
    connected: false,
    description: 'Create expense databases in Notion',
  },
  {
    id: 'airtable',
    name: 'Airtable',
    icon: '🗃️',
    color: '#18BFFF',
    connected: false,
    description: 'Sync with Airtable bases for advanced workflows',
  },
];

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'full-export',
    name: 'Full Export',
    description: 'Export all expense data with complete details',
    icon: '📋',
    fields: ['Date', 'Category', 'Amount', 'Description', 'Created At'],
    filters: { dateRange: 'all' },
  },
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'Formatted for tax filing with deductible categories',
    icon: '🧾',
    fields: ['Date', 'Category', 'Amount', 'Description', 'Tax Category'],
    filters: { dateRange: 'last-year' },
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Aggregated spending by category for the current month',
    icon: '📅',
    fields: ['Category', 'Total Amount', 'Transaction Count', 'Average'],
    filters: { dateRange: 'last-month' },
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Deep dive into spending patterns by category',
    icon: '📈',
    fields: ['Category', 'Amount', 'Percentage', 'Trend'],
    filters: { dateRange: 'last-quarter' },
  },
  {
    id: 'weekly-digest',
    name: 'Weekly Digest',
    description: 'Compact summary of the last 7 days',
    icon: '📰',
    fields: ['Day', 'Total Spent', 'Top Category', 'Transaction Count'],
    filters: { dateRange: 'last-week' },
  },
];

// ============================================================================
// Storage Keys
// ============================================================================

const STORAGE_KEYS = {
  INTEGRATIONS: 'expense-tracker-integrations',
  HISTORY: 'expense-tracker-export-history',
  SCHEDULES: 'expense-tracker-scheduled-exports',
  SHARES: 'expense-tracker-shares',
};

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateShareLink(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `https://expensetracker.app/share/${result}`;
}

function generateQRCodeUrl(link: string): string {
  // Using a QR code API (simulated)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
}

function calculateFileSize(recordCount: number): string {
  const avgBytesPerRecord = 150;
  const bytes = recordCount * avgBytesPerRecord;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================================================
// Cloud Export Service
// ============================================================================

class CloudExportService {
  // Get connected integrations
  getIntegrations(): CloudIntegration[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
      if (stored) {
        const connections = JSON.parse(stored) as Record<string, boolean>;
        return INTEGRATIONS.map((integration) => ({
          ...integration,
          connected: connections[integration.id] ?? integration.connected,
        }));
      }
    } catch (e) {
      console.error('Failed to load integrations:', e);
    }
    return INTEGRATIONS;
  }

  // Connect/disconnect an integration
  async toggleIntegration(id: IntegrationType): Promise<boolean> {
    // Simulate OAuth flow delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
      const connections = stored ? JSON.parse(stored) : {};
      const currentState = connections[id] ?? false;
      connections[id] = !currentState;
      localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(connections));
      return connections[id];
    } catch (e) {
      console.error('Failed to toggle integration:', e);
      return false;
    }
  }

  // Get export history
  getExportHistory(): ExportHistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load export history:', e);
      return [];
    }
  }

  // Add export to history
  private addToHistory(item: ExportHistoryItem): void {
    try {
      const history = this.getExportHistory();
      history.unshift(item);
      // Keep only last 50 exports
      const trimmed = history.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save export history:', e);
    }
  }

  // Clear export history
  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }

  // Export to cloud integration
  async exportToCloud(
    expenses: Expense[],
    template: ExportTemplateType,
    destination: IntegrationType
  ): Promise<ExportHistoryItem> {
    const exportId = generateId();

    // Create pending history item
    const historyItem: ExportHistoryItem = {
      id: exportId,
      timestamp: new Date().toISOString(),
      template,
      destination,
      status: 'processing',
      recordCount: expenses.length,
      fileSize: calculateFileSize(expenses.length),
    };

    // Simulate cloud upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 90% success rate simulation
    const success = Math.random() > 0.1;

    if (success) {
      historyItem.status = 'completed';
    } else {
      historyItem.status = 'failed';
      historyItem.error = 'Connection timeout. Please try again.';
    }

    this.addToHistory(historyItem);
    return historyItem;
  }

  // Export via email
  async exportViaEmail(
    expenses: Expense[],
    template: ExportTemplateType,
    email: string
  ): Promise<ExportHistoryItem> {
    const exportId = generateId();

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const historyItem: ExportHistoryItem = {
      id: exportId,
      timestamp: new Date().toISOString(),
      template,
      destination: 'email',
      status: 'completed',
      recordCount: expenses.length,
      fileSize: calculateFileSize(expenses.length),
    };

    this.addToHistory(historyItem);
    return historyItem;
  }

  // Create shareable link
  async createShareableLink(
    expenses: Expense[],
    template: ExportTemplateType,
    options: { expiresIn: number; maxAccess: number; password?: string }
  ): Promise<ShareableExport> {
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const link = generateShareLink();
    const shareableExport: ShareableExport = {
      id: generateId(),
      link,
      qrCode: generateQRCodeUrl(link),
      expiresAt: new Date(Date.now() + options.expiresIn * 24 * 60 * 60 * 1000).toISOString(),
      accessCount: 0,
      maxAccess: options.maxAccess,
      password: options.password,
    };

    // Save to storage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHARES);
      const shares = stored ? JSON.parse(stored) : [];
      shares.unshift(shareableExport);
      localStorage.setItem(STORAGE_KEYS.SHARES, JSON.stringify(shares.slice(0, 20)));
    } catch (e) {
      console.error('Failed to save share:', e);
    }

    // Add to history
    const historyItem: ExportHistoryItem = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      template,
      destination: 'share-link',
      status: 'completed',
      recordCount: expenses.length,
      shareLink: link,
    };
    this.addToHistory(historyItem);

    return shareableExport;
  }

  // Get shareable exports
  getShares(): ShareableExport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SHARES);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load shares:', e);
      return [];
    }
  }

  // Get scheduled exports
  getScheduledExports(): ScheduledExport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load schedules:', e);
      return [];
    }
  }

  // Create scheduled export
  createSchedule(
    template: ExportTemplateType,
    destination: IntegrationType,
    frequency: ScheduleFrequency
  ): ScheduledExport {
    const now = new Date();
    let nextRun: Date;

    switch (frequency) {
      case 'daily':
        nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextRun = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
    }

    const schedule: ScheduledExport = {
      id: generateId(),
      template,
      destination,
      frequency,
      nextRun: nextRun.toISOString(),
      enabled: true,
      createdAt: now.toISOString(),
    };

    try {
      const schedules = this.getScheduledExports();
      schedules.push(schedule);
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (e) {
      console.error('Failed to save schedule:', e);
    }

    return schedule;
  }

  // Toggle schedule enabled/disabled
  toggleSchedule(id: string): void {
    try {
      const schedules = this.getScheduledExports();
      const index = schedules.findIndex((s) => s.id === id);
      if (index !== -1) {
        schedules[index].enabled = !schedules[index].enabled;
        localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
      }
    } catch (e) {
      console.error('Failed to toggle schedule:', e);
    }
  }

  // Delete schedule
  deleteSchedule(id: string): void {
    try {
      const schedules = this.getScheduledExports().filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (e) {
      console.error('Failed to delete schedule:', e);
    }
  }

  // Generate export data based on template
  generateExportData(expenses: Expense[], template: ExportTemplateType): string {
    const templateConfig = EXPORT_TEMPLATES.find((t) => t.id === template);
    if (!templateConfig) return '';

    // Apply filters based on template
    let filtered = [...expenses];
    if (templateConfig.filters?.dateRange) {
      const now = new Date();
      let startDate: Date;

      switch (templateConfig.filters.dateRange) {
        case 'last-week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last-month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case 'last-quarter':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case 'last-year':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter((e) => new Date(e.date) >= startDate);
    }

    return JSON.stringify(filtered, null, 2);
  }
}

export const cloudExportService = new CloudExportService();
